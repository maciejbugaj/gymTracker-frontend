import { useState } from 'react'
import { Checkbox } from 'flowbite-react'
import type { ExerciseLog } from '../types'
import { useLogExerciseSet, useRemoveSetRow } from '../hooks/useExerciseLog'
import { useStore } from '../stores/StoreSession'

interface ExerciseSetsTableProps {
    sessionId: number
    exerciseName: string
    setsTarget?: number
    repsPlaceholder: string
    /** Every set of this exercise from the last finished session, ordered by set number. */
    previousLogs: ExerciseLog[]
    /** Sets already saved in the ongoing session. */
    currentLogs: ExerciseLog[]
}

type SetDraft = { reps?: string; weightKg?: string }
type DraftField = keyof SetDraft

// Same columns for the header and every row, so they line up without a real <table>.
const ROW_GRID = 'grid grid-cols-[1.5rem_4rem_1fr_1fr_1.75rem_1.5rem] gap-1 items-center'
const INPUT_CLASS = 'w-full text-center border border-gray-200 rounded-lg px-1 py-1 text-sm disabled:bg-gray-700 disabled:text-gray-400 disabled:border-gray-700'

function formatPrevious(log: ExerciseLog | undefined): string {
    return log ? `${log.reps ?? 0}×${log.weightKg ?? 0}` : '—'
}

export default function ExerciseSetsTable({
    sessionId,
    exerciseName,
    setsTarget,
    repsPlaceholder,
    previousLogs,
    currentLogs,
}: ExerciseSetsTableProps) {
    // Only what the user typed lives here — everything else falls back to the saved set, then to
    // the previous session, so late-arriving query data never has to be copied into state.
    const [drafts, setDrafts] = useState<Record<number, SetDraft>>({})
    const storedRowCount = useStore(state => state.setRowCounts[`${sessionId}:${exerciseName}`])
    const setRowCount = useStore(state => state.setRowCount)
    const { mutate: logExerciseSet, isPending: isSaving } = useLogExerciseSet()
    const { mutate: removeSetRow, isPending: isRemoving } = useRemoveSetRow()

    const savedByRow = new Map(currentLogs.map(log => [log.setNumber ?? 0, log]))
    const previousByRow = new Map(previousLogs.map(log => [log.setNumber ?? 0, log]))
    const highestSavedRow = currentLogs.reduce((max, log) => Math.max(max, log.setNumber ?? 0), 0)

    const defaultRowCount = Math.max(setsTarget ?? 0, previousLogs.length, 1)
    // Never hide a set that is already saved, even if the user shrank the table earlier.
    const rowCount = Math.max(storedRowCount ?? defaultRowCount, highestSavedRow)
    const rows = Array.from({ length: rowCount }, (_, index) => index + 1)
    const isBusy = isSaving || isRemoving

    function valueFor(row: number, field: DraftField): string {
        const draft = drafts[row]?.[field]
        if (draft !== undefined) return draft

        const saved = savedByRow.get(row)
        if (saved) return saved[field] != null ? String(saved[field]) : ''

        const previous = previousByRow.get(row)
        if (previous) return previous[field] != null ? String(previous[field]) : ''

        return ''
    }

    function handleDraftChange(row: number, field: DraftField, value: string) {
        setDrafts(previous => ({ ...previous, [row]: { ...previous[row], [field]: value } }))
    }

    function handleToggleRow(row: number) {
        const saved = savedByRow.get(row)

        if (saved?.id != null) {
            // Unticking only drops this set — the rows around it keep their numbers.
            removeSetRow({ workoutSessionId: sessionId, exerciseName, logIdToDelete: saved.id })
            return
        }

        logExerciseSet({
            workoutSessionId: sessionId,
            exerciseName,
            setNumber: row,
            reps: Number(valueFor(row, 'reps')),
            weightKg: Number(valueFor(row, 'weightKg') || 0),
        })
    }

    function handleAddSet() {
        const newRow = rowCount + 1
        // A new set starts from what the last row shows, which is what the user is about to repeat.
        setDrafts(previous => ({
            ...previous,
            [newRow]: { reps: valueFor(rowCount, 'reps'), weightKg: valueFor(rowCount, 'weightKg') },
        }))
        setRowCount(sessionId, exerciseName, newRow)
    }

    function handleRemoveRow(row: number) {
        const renumberLogIds = currentLogs
            .filter(log => (log.setNumber ?? 0) !== row && log.id != null)
            .sort((a, b) => (a.setNumber ?? 0) - (b.setNumber ?? 0))
            .map(log => log.id!)

        removeSetRow({
            workoutSessionId: sessionId,
            exerciseName,
            logIdToDelete: savedByRow.get(row)?.id,
            renumberLogIds,
        })

        setDrafts(previous => {
            const shifted: Record<number, SetDraft> = {}
            for (const [key, draft] of Object.entries(previous)) {
                const draftRow = Number(key)
                if (draftRow === row) continue
                shifted[draftRow > row ? draftRow - 1 : draftRow] = draft
            }
            return shifted
        })
        setRowCount(sessionId, exerciseName, rowCount - 1)
    }

    return (
        <div className="text-left">
            <div className={`${ROW_GRID} text-[10px] uppercase tracking-wider text-gray-500 mb-1`}>
                <span>Set</span>
                <span>Prev</span>
                <span className="text-center">Reps</span>
                <span className="text-center">Kg</span>
                <span />
                <span />
            </div>

            {rows.map(row => {
                const saved = savedByRow.get(row)
                const isSaved = saved != null
                const repsValue = valueFor(row, 'reps')
                const canSave = repsValue !== '' && Number(repsValue) > 0

                return (
                    <div key={row} className={`${ROW_GRID} mb-1`}>
                        <span className="stat-number text-sm">{row}</span>
                        <span className="font-mono text-xs text-gray-500">{formatPrevious(previousByRow.get(row))}</span>
                        <input
                            className={INPUT_CLASS}
                            type="number"
                            inputMode="numeric"
                            aria-label={`Reps, set ${row}, ${exerciseName}`}
                            placeholder={repsPlaceholder}
                            disabled={isSaved}
                            value={repsValue}
                            onChange={event => handleDraftChange(row, 'reps', event.target.value)}
                        />
                        <input
                            className={INPUT_CLASS}
                            type="number"
                            inputMode="decimal"
                            aria-label={`Weight in kg, set ${row}, ${exerciseName}`}
                            placeholder="0"
                            disabled={isSaved}
                            value={valueFor(row, 'weightKg')}
                            onChange={event => handleDraftChange(row, 'weightKg', event.target.value)}
                        />
                        <Checkbox
                            className="justify-self-center"
                            aria-label={`Save set ${row} of ${exerciseName}`}
                            title={!isSaved && !canSave ? 'Enter reps first' : undefined}
                            checked={isSaved}
                            disabled={isBusy || (!isSaved && !canSave)}
                            onChange={() => handleToggleRow(row)}
                        />
                        <button
                            type="button"
                            aria-label={`Remove set ${row} of ${exerciseName}`}
                            className="text-gray-500 hover:text-red-400 text-sm disabled:opacity-30"
                            disabled={isBusy || rowCount === 1}
                            onClick={() => handleRemoveRow(row)}
                        >
                            ×
                        </button>
                    </div>
                )
            })}

            <button
                type="button"
                className="mt-1 w-full rounded-lg border border-dashed border-gray-600 py-1 text-xs text-gray-400 hover:text-violet-300 hover:border-violet-500 disabled:opacity-40"
                disabled={isBusy}
                onClick={handleAddSet}
            >
                + Add Set
            </button>
        </div>
    )
}
