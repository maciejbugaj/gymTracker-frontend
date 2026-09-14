import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useActivateProgram, useArchiveProgram, useProgram, useUpdateProgram } from '../hooks/useTrainingPrograms'
import { useCreateSession } from '../hooks/useSessions'
import type { TrainingProgram, TrainingProgramRequest } from '../types'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import { INPUT_CLASS, LABEL_CLASS, NUMBER_INPUT_CLASS } from '../components/ui/form'

// TrainingProgram (the response) carries id/status/source/createdAt and nested ids on top of
// everything TrainingProgramRequest needs — structurally a superset, so this is just dropping
// the extra fields rather than remapping every level.
function toProgramRequest(program: TrainingProgram): TrainingProgramRequest {
    return {
        name: program.name,
        description: program.description,
        goal: program.goal,
        experienceLevel: program.experienceLevel,
        durationWeeks: program.durationWeeks,
        daysPerWeek: program.daysPerWeek,
        weeks: program.weeks,
    }
}

export default function ProgramDetail() {
    const { id } = useParams<{ id: string }>()
    const programId = id ? parseInt(id, 10) : undefined
    const navigate = useNavigate()

    const { data: program, isLoading, error } = useProgram(programId)
    const { mutate: activate, isPending: isActivating } = useActivateProgram()
    const { mutate: archive, isPending: isArchiving } = useArchiveProgram()
    const { mutate: updateProgram, isPending: isSaving } = useUpdateProgram()
    const { mutate: createSession } = useCreateSession()

    const [expandedWeek, setExpandedWeek] = useState<number | null>(0)
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState<TrainingProgram | null>(null)

    if (isLoading) {
        return <div className="w-full px-4 pt-16 text-center text-[13px] text-steel">Loading…</div>
    }

    if (error || !program) {
        return (
            <div role="alert" className="w-full px-4 pt-16 text-center text-[13px] text-danger">
                This program didn't load. Go back to Programs and open it again.
            </div>
        )
    }

    const displayed = isEditing && draft ? draft : program

    function startEditing() {
        setDraft(structuredClone(program!))
        setIsEditing(true)
    }

    function cancelEditing() {
        setIsEditing(false)
        setDraft(null)
    }

    function updateExercise(weekIndex: number, dayIndex: number, exerciseIndex: number, patch: { targetSets?: number; targetRepsMin?: number; targetRepsMax?: number }) {
        setDraft(prev => {
            if (!prev) return prev
            const next = structuredClone(prev)
            Object.assign(next.weeks[weekIndex].days[dayIndex].exercises[exerciseIndex], patch)
            return next
        })
    }

    function handleSave() {
        if (!draft) return
        updateProgram(
            { id: draft.id, data: toProgramRequest(draft) },
            { onSuccess: () => { setIsEditing(false); setDraft(null) } }
        )
    }

    return (
        <div className="w-full pb-24">
            <div className="px-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/programs')}
                    className="cursor-pointer font-condensed text-[13px] font-semibold text-steel transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    ← Programs
                </button>
            </div>

            <header className="px-4 pb-3 pt-3">
                {isEditing && draft ? (
                    <div className="flex flex-col gap-3">
                        <div>
                            <label htmlFor="program-name" className={LABEL_CLASS}>Name</label>
                            <input id="program-name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={INPUT_CLASS} />
                        </div>
                        <div>
                            <label htmlFor="program-description" className={LABEL_CLASS}>Description</label>
                            <input id="program-description" value={draft.description ?? ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className={INPUT_CLASS} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <h1 className="font-condensed text-[26px] font-bold leading-none">{program.name}</h1>
                            <StatusBadge status={program.status} />
                        </div>
                        {program.description && <p className="mt-1.5 text-[12.5px] text-steel">{program.description}</p>}
                        <p className="mt-1 text-[11.5px] text-steel">
                            <span className="font-medium text-chalk-dim">{program.durationWeeks}</span> weeks ·
                            <span className="font-medium text-chalk-dim"> {program.daysPerWeek}</span> days a week
                        </p>
                    </>
                )}
            </header>

            <div className="flex flex-wrap gap-2 px-4 pb-4">
                {isEditing ? (
                    <>
                        <Button variant="solid" size="sm" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Button variant="quiet" size="sm" onClick={cancelEditing}>Cancel</Button>
                    </>
                ) : (
                    <>
                        {program.status !== 'ACTIVE' && (
                            <Button variant="solid" size="sm" onClick={() => activate(program.id)} disabled={isActivating}>
                                {isActivating ? 'Activating…' : 'Activate'}
                            </Button>
                        )}
                        <Button variant="quiet" size="sm" onClick={startEditing}>Edit</Button>
                        {program.status !== 'ARCHIVED' && (
                            <Button variant="outline" size="sm" onClick={() => archive(program.id)} disabled={isArchiving}>
                                {isArchiving ? 'Archiving…' : 'Archive'}
                            </Button>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-col gap-0.5">
                {displayed.weeks.map((week, weekIndex) => (
                    <div key={week.id} className={week.isDeload ? 'border-l-[3px] border-accent bg-platform-800' : 'bg-platform-800'}>
                        <button
                            type="button"
                            aria-expanded={expandedWeek === weekIndex}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                            onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
                        >
                            <span className="font-condensed text-[16px] font-semibold">
                                Week {week.weekNumber}{week.focus ? ` — ${week.focus}` : ''}
                            </span>
                            {week.isDeload && (
                                <span className="shrink-0 bg-accent px-2 py-0.5 font-condensed text-[12px] font-semibold text-platform-900">Deload</span>
                            )}
                        </button>

                        {expandedWeek === weekIndex && (
                            <div className="flex flex-col gap-0.5 pb-0.5">
                                {week.days.map((day, dayIndex) => (
                                    <div key={day.id} className="bg-platform-750 px-4 py-3">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="font-condensed text-[15px] font-semibold text-chalk-dim">
                                                Day {day.dayNumber}{day.name ? ` — ${day.name}` : ''}
                                            </p>
                                            {!isEditing && program.status === 'ACTIVE' && (
                                                <Button size="sm" onClick={() => createSession({ programDayId: day.id })}>
                                                    Start
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {day.exercises.map((exercise, exerciseIndex) => (
                                                <div key={exercise.id} className="flex items-center justify-between gap-2 text-[13px]">
                                                    <span className="min-w-0 flex-1 truncate text-chalk-dim">{exercise.exerciseName}</span>
                                                    {isEditing ? (
                                                        <span className="flex shrink-0 items-center gap-1">
                                                            <input
                                                                type="number" min={1} value={exercise.targetSets}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetSets: Number(e.target.value) })}
                                                                className={NUMBER_INPUT_CLASS}
                                                                aria-label={`${exercise.exerciseName} sets`}
                                                            />
                                                            <span className="text-steel-dark">×</span>
                                                            <input
                                                                type="number" min={1} value={exercise.targetRepsMin}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMin: Number(e.target.value) })}
                                                                className={NUMBER_INPUT_CLASS}
                                                                aria-label={`${exercise.exerciseName} min reps`}
                                                            />
                                                            <span className="text-steel-dark">–</span>
                                                            <input
                                                                type="number" min={1} value={exercise.targetRepsMax}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMax: Number(e.target.value) })}
                                                                className={NUMBER_INPUT_CLASS}
                                                                aria-label={`${exercise.exerciseName} max reps`}
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span className="shrink-0 font-condensed text-[14px] font-semibold text-steel">
                                                            {exercise.targetSets} × {exercise.targetRepsMin}–{exercise.targetRepsMax}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
