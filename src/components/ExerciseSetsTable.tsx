import { useState } from 'react'
import type { ExerciseLog } from '../types'
import { useLogExerciseSet, useRemoveSetRow } from '../hooks/useExerciseLog'
import { useStore } from '../stores/StoreSession'
import PlateLoad from './PlateLoad'
import Button from './ui/Button'

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
const ROW_GRID = 'grid grid-cols-[18px_46px_1fr_1fr_44px_26px] gap-1.5 items-center px-4'
const INPUT_CLASS =
    'w-full rounded-sm border border-platform-500 bg-platform-900 px-1 py-2 text-center font-condensed ' +
    'text-[17px] font-semibold text-chalk focus:border-accent focus:outline-none ' +
    'disabled:border-transparent disabled:bg-transparent disabled:text-chalk'
const VALUE_CLASS = 'py-2 text-center font-condensed text-[17px] font-bold text-chalk'

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

    // The set you are about to do — what the readout and the plate bar describe. Once every
    // row is saved it falls back to the last one, so the panel never goes blank mid-exercise.
    const workingRow = rows.find(row => !savedByRow.has(row)) ?? rowCount
    const workingWeight = valueFor(workingRow, 'weightKg')
    const workingReps = valueFor(workingRow, 'reps')

    return (
        <div className="text-left">
            {workingWeight !== '' && (
                <div className="flex flex-col gap-1.5 bg-platform-800 px-4 pb-3 pt-2.5">
                    <div className="flex items-end gap-2">
                        <span className="font-condensed text-[46px] font-bold leading-[0.82] tracking-tight">{workingWeight}</span>
                        <span className="pb-1 font-condensed text-[15px] font-semibold text-steel">kg</span>
                        {workingReps !== '' && (
                            <span className="ml-auto pb-1 font-condensed text-[20px] font-semibold text-steel">× {workingReps}</span>
                        )}
                    </div>
                    <PlateLoad weightKg={Number(workingWeight)} />
                </div>
            )}

            <div className={`${ROW_GRID} pb-1 font-condensed text-[11px] font-semibold tracking-wide text-steel-dark`}>
                <span aria-hidden="true" />
                <span>Prev</span>
                <span className="text-center">Reps</span>
                <span className="text-center">Kg</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </div>

            {rows.map(row => {
                const saved = savedByRow.get(row)
                const isSaved = saved != null
                const repsValue = valueFor(row, 'reps')
                const canSave = repsValue !== '' && Number(repsValue) > 0

                return (
                    <div
                        key={row}
                        className={`${ROW_GRID} py-1.5 ${row % 2 === 0 ? 'bg-platform-750' : 'bg-platform-800'}`}
                    >
                        <span className="font-condensed text-[14px] font-bold text-steel-dark">{row}</span>
                        <span className="font-condensed text-[13px] font-semibold text-steel-dark">
                            {formatPrevious(previousByRow.get(row))}
                        </span>

                        {isSaved ? (
                            <>
                                <span className={VALUE_CLASS}>{repsValue || '—'}</span>
                                <span className={VALUE_CLASS}>{valueFor(row, 'weightKg') || '—'}</span>
                            </>
                        ) : (
                            <>
                                <input
                                    className={INPUT_CLASS}
                                    type="number"
                                    inputMode="numeric"
                                    aria-label={`Reps, set ${row}, ${exerciseName}`}
                                    placeholder={repsPlaceholder}
                                    value={repsValue}
                                    onChange={event => handleDraftChange(row, 'reps', event.target.value)}
                                />
                                <input
                                    className={INPUT_CLASS}
                                    type="number"
                                    inputMode="decimal"
                                    aria-label={`Weight in kg, set ${row}, ${exerciseName}`}
                                    placeholder="0"
                                    value={valueFor(row, 'weightKg')}
                                    onChange={event => handleDraftChange(row, 'weightKg', event.target.value)}
                                />
                            </>
                        )}

                        <button
                            type="button"
                            role="switch"
                            aria-checked={isSaved}
                            aria-label={`Save set ${row} of ${exerciseName}`}
                            title={!isSaved && !canSave ? 'Enter reps first' : undefined}
                            disabled={isBusy || (!isSaved && !canSave)}
                            onClick={() => handleToggleRow(row)}
                            className={`flex h-9 w-11 cursor-pointer items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 ${
                                isSaved ? 'bg-good' : 'bg-platform-600 hover:bg-platform-500'
                            }`}
                        >
                            {isSaved && (
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#fff" strokeWidth="3" aria-hidden="true">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label={`Remove set ${row} of ${exerciseName}`}
                            className="cursor-pointer text-[18px] leading-none text-steel-dark transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={isBusy || rowCount === 1}
                            onClick={() => handleRemoveRow(row)}
                        >
                            ×
                        </button>
                    </div>
                )
            })}

            <div className="bg-platform-800 px-4 pb-3 pt-2">
                <Button variant="outline" size="sm" className="w-full" disabled={isBusy} onClick={handleAddSet}>
                    Add set
                </Button>
            </div>
        </div>
    )
}
