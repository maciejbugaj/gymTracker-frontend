import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button } from 'flowbite-react'
import { useActivateProgram, useArchiveProgram, useProgram } from '../hooks/useTrainingPrograms'
import { useCreateSession } from '../hooks/useSessions'
import type { ProgramStatus } from '../types'

const statusColor: Record<ProgramStatus, string> = {
    ACTIVE: 'purple',
    DRAFT: 'blue',
    ARCHIVED: 'gray',
}

export default function ProgramDetail() {
    const { id } = useParams<{ id: string }>()
    const programId = id ? parseInt(id, 10) : undefined
    const navigate = useNavigate()

    const { data: program, isLoading, error } = useProgram(programId)
    const { mutate: activate, isPending: isActivating } = useActivateProgram()
    const { mutate: archive, isPending: isArchiving } = useArchiveProgram()
    const { mutate: createSession } = useCreateSession()

    const [expandedWeek, setExpandedWeek] = useState<number | null>(0)

    if (isLoading) {
        return <div className="w-full px-4 pt-16 text-center text-gray-500">Loading…</div>
    }

    if (error || !program) {
        return <div className="w-full px-4 pt-16 text-center text-red-400">Failed to load program.</div>
    }

    return (
        <div className="w-full px-4 pb-24 pt-2">
            <div className="flex items-center gap-3 mb-2 pt-2 px-2">
                <button onClick={() => navigate('/programs')} className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                    ← Back
                </button>
            </div>

            <div className="px-2 pb-2">
                <div className="flex items-center gap-2 mb-1">
                    <h1>{program.name}</h1>
                    <Badge color={statusColor[program.status]}>{program.status}</Badge>
                </div>
                {program.description && <p className="text-gray-500 text-sm">{program.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{program.durationWeeks} weeks · {program.daysPerWeek}x/week</p>
            </div>

            <div className="flex gap-2 px-2 mb-4">
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
            </div>

            <div className="flex flex-col gap-2">
                {program.weeks.map((week, weekIndex) => (
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
                                {week.days.map(day => (
                                    <div key={day.id} className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-200">
                                                Day {day.dayNumber}{day.name ? ` · ${day.name}` : ''}
                                            </p>
                                            {program.status === 'ACTIVE' && (
                                                <Button
                                                    size="xs" color="purple"
                                                    onClick={() => createSession({ programDayId: day.id })}
                                                >
                                                    Start Workout
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {day.exercises.map(exercise => (
                                                <div key={exercise.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-300">{exercise.exerciseName}</span>
                                                    <span className="text-gray-500 text-xs">
                                                        {exercise.targetSets} × {exercise.targetRepsMin}–{exercise.targetRepsMax}
                                                    </span>
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
