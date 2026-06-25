import { useState } from 'react'
import { Card } from 'flowbite-react'
import { useSessions } from '../hooks/useSessions'
import type { ExerciseLog, WorkoutSession } from '../types'
import { formatSessionDate } from '../utils/date'

function calcTotalWeight(logs: ExerciseLog[]): number {
    return logs.reduce((sum, log) => sum + (log.reps ?? 0) * (log.weightKg ?? 0), 0)
}

function groupByExercise(logs: ExerciseLog[]): Map<string, ExerciseLog[]> {
    const map = new Map<string, ExerciseLog[]>()
    for (const log of logs) {
        const existing = map.get(log.exerciseName) ?? []
        map.set(log.exerciseName, [...existing, log])
    }
    return map
}

function formatDurationMinutes(seconds: number): string {
    return `${Math.round(seconds / 60)} min`
}

function SessionCard({ session }: { session: WorkoutSession }) {
    const [expanded, setExpanded] = useState(false)
    const logs = session.exerciseLogs ?? []
    const totalWeight = calcTotalWeight(logs)
    const exerciseGroups = groupByExercise(logs)

    return (
        <Card className="mb-3">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h2 className="text-base font-semibold">{session.workoutTemplateName}</h2>
                    <p className="text-xs text-gray-500">{formatSessionDate(session.startedAt)}</p>
                </div>
            </div>
            <div className="flex gap-4 text-xs text-gray-400 mt-1">
                {session.durationSeconds != null && (
                    <span>⏱ {formatDurationMinutes(session.durationSeconds)}</span>
                )}
                {totalWeight > 0 && (
                    <span>⚖ {totalWeight.toLocaleString()} kg total</span>
                )}
            </div>
            {logs.length > 0 && (
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="mt-2 text-xs text-violet-400 hover:text-violet-300 font-medium text-left"
                >
                    {expanded ? '▴ Hide exercises' : '▾ Show exercises'}
                </button>
            )}
            {expanded && (
                <div className="mt-3 flex flex-col gap-3">
                    {Array.from(exerciseGroups.entries()).map(([name, sets]) => (
                        <div key={name}>
                            <p className="text-xs font-semibold text-gray-300 mb-1">{name}</p>
                            <div className="flex flex-wrap gap-2">
                                {sets.map((log, i) => (
                                    <span
                                        key={log.id ?? i}
                                        className="font-mono text-xs bg-gray-700 text-gray-300 rounded px-2 py-1"
                                    >
                                        Set {log.setNumber ?? i + 1}: {log.reps} × {log.weightKg}kg
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}

export default function History() {
    const { data: sessions, isLoading, error } = useSessions()

    return (
        <div className="w-full px-4 pb-20">
            <div className="p-4">
                <h1>History</h1>
                <p className="text-gray-500 text-sm">Past workout sessions</p>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-700 animate-pulse rounded-xl" />
                    ))}
                </div>
            )}

            {error && (
                <p className="text-red-400 text-sm">Failed to load sessions.</p>
            )}

            {sessions && sessions.length === 0 && (
                <p className="text-gray-500 text-sm">No workout sessions yet.</p>
            )}

            {sessions?.map(session => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    )
}
