import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button } from 'flowbite-react'
import { useActivateProgram, useArchiveProgram, useProgram, useUpdateProgram } from '../hooks/useTrainingPrograms'
import { useCreateSession } from '../hooks/useSessions'
import type { ProgramStatus, TrainingProgram, TrainingProgramRequest } from '../types'

const statusColor: Record<ProgramStatus, string> = {
    ACTIVE: 'purple',
    DRAFT: 'blue',
    ARCHIVED: 'gray',
}

const inputClass = "w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"

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
        return <div className="w-full px-4 pt-16 text-center text-gray-500">Loading…</div>
    }

    if (error || !program) {
        return <div className="w-full px-4 pt-16 text-center text-red-400">Failed to load program.</div>
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
        <div className="w-full px-4 pb-24 pt-2">
            <div className="flex items-center gap-3 mb-2 pt-2 px-2">
                <button onClick={() => navigate('/programs')} className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                    ← Back
                </button>
            </div>

            <div className="px-2 pb-2">
                {isEditing && draft ? (
                    <>
                        <label className="block text-xs text-gray-400 mb-1">Name</label>
                        <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={`${inputClass} mb-2`} />
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <input value={draft.description ?? ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className={inputClass} />
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <h1>{program.name}</h1>
                            <Badge color={statusColor[program.status]}>{program.status}</Badge>
                        </div>
                        {program.description && <p className="text-gray-500 text-sm">{program.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">{program.durationWeeks} weeks · {program.daysPerWeek}x/week</p>
                    </>
                )}
            </div>

            <div className="flex gap-2 px-2 mb-4">
                {isEditing ? (
                    <>
                        <Button color="alternative" size="xs" onClick={cancelEditing}>Cancel</Button>
                        <Button color="purple" size="xs" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </>
                ) : (
                    <>
                        {program.status !== 'ACTIVE' && (
                            <Button color="purple" size="xs" onClick={() => activate(program.id)} disabled={isActivating}>
                                Activate
                            </Button>
                        )}
                        {program.status !== 'ARCHIVED' && (
                            <Button color="alternative" size="xs" onClick={() => archive(program.id)} disabled={isArchiving}>
                                Archive
                            </Button>
                        )}
                        <Button color="alternative" size="xs" onClick={startEditing}>Edit</Button>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {displayed.weeks.map((week, weekIndex) => (
                    <div key={week.id} className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
                            onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
                        >
                            <span className="text-sm font-medium text-gray-100">
                                Week {week.weekNumber}{week.focus ? ` · ${week.focus}` : ''}
                            </span>
                            {week.isDeload && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Deload</span>
                            )}
                        </button>
                        {expandedWeek === weekIndex && (
                            <div className="px-4 pb-4 flex flex-col gap-3">
                                {week.days.map((day, dayIndex) => (
                                    <div key={day.id} className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-200">
                                                Day {day.dayNumber}{day.name ? ` · ${day.name}` : ''}
                                            </p>
                                            {!isEditing && program.status === 'ACTIVE' && (
                                                <Button
                                                    size="xs" color="purple"
                                                    onClick={() => createSession({ programDayId: day.id })}
                                                >
                                                    Start Workout
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {day.exercises.map((exercise, exerciseIndex) => (
                                                <div key={exercise.id} className="flex items-center justify-between text-sm gap-2">
                                                    <span className="text-gray-300 flex-1 truncate">{exercise.exerciseName}</span>
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                type="number" min={1} value={exercise.targetSets}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetSets: Number(e.target.value) })}
                                                                className="w-10 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                                aria-label={`${exercise.exerciseName} sets`}
                                                            />
                                                            <span className="text-gray-500 text-xs">×</span>
                                                            <input
                                                                type="number" min={1} value={exercise.targetRepsMin}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMin: Number(e.target.value) })}
                                                                className="w-10 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                                aria-label={`${exercise.exerciseName} min reps`}
                                                            />
                                                            <span className="text-gray-500 text-xs">–</span>
                                                            <input
                                                                type="number" min={1} value={exercise.targetRepsMax}
                                                                onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMax: Number(e.target.value) })}
                                                                className="w-10 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                                aria-label={`${exercise.exerciseName} max reps`}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">
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
