import { useState } from 'react'
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

function SessionRow({ session }: { session: WorkoutSession }) {
    const [expanded, setExpanded] = useState(false)
    const logs = session.exerciseLogs ?? []
    const totalWeight = calcTotalWeight(logs)
    const exerciseGroups = groupByExercise(logs)

    return (
        <div className="bg-platform-800">
            <div className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                    <p className="font-condensed text-[16px] font-semibold leading-tight">
                        {session.workoutTemplateName ?? session.dayName}
                    </p>
                    <p className="shrink-0 text-[11.5px] text-steel">{formatSessionDate(session.startedAt)}</p>
                </div>
                <p className="mt-1 flex flex-wrap gap-x-4 text-[11.5px] text-steel">
                    {session.durationSeconds != null && (
                        <span><span className="font-medium text-chalk-dim">{formatDurationMinutes(session.durationSeconds)}</span></span>
                    )}
                    {logs.length > 0 && (
                        <span><span className="font-medium text-chalk-dim">{logs.length}</span> {logs.length === 1 ? 'set' : 'sets'}</span>
                    )}
                    {totalWeight > 0 && (
                        <span><span className="font-medium text-chalk-dim">{totalWeight.toLocaleString()}</span> kg total</span>
                    )}
                </p>
                {logs.length > 0 && (
                    <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpanded(e => !e)}
                        className="mt-2 cursor-pointer font-condensed text-[13px] font-semibold text-accent transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        {expanded ? 'Hide exercises' : 'Show exercises'}
                    </button>
                )}
            </div>

            {expanded && (
                <div className="flex flex-col gap-3 bg-platform-750 px-4 py-3">
                    {Array.from(exerciseGroups.entries()).map(([name, sets]) => (
                        <div key={name}>
                            <p className="mb-1 font-condensed text-[14px] font-semibold text-chalk-dim">{name}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {sets.map((log, i) => (
                                    <span
                                        key={log.id ?? i}
                                        className="bg-platform-600 px-2 py-0.5 font-condensed text-[13px] font-semibold"
                                    >
                                        {log.reps} × {log.weightKg} kg
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function History() {
    const { data: sessions, isLoading, error } = useSessions()

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <h1 className="font-condensed text-[26px] font-bold leading-none">History</h1>
                <p className="mt-1 text-[12.5px] text-steel">Every session you've finished.</p>
            </header>

            {isLoading && (
                <div className="flex flex-col gap-0.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[84px] animate-pulse bg-platform-800" />
                    ))}
                    <span className="sr-only">Loading your sessions…</span>
                </div>
            )}

            {error && (
                <p role="alert" className="bg-platform-800 px-4 py-3 text-[13px] text-danger">
                    Your sessions didn't load. Try again in a moment.
                </p>
            )}

            {sessions && sessions.length === 0 && (
                <p className="bg-platform-800 px-4 py-3 text-[13px] text-steel">
                    Nothing here yet. Finish a session and it will show up.
                </p>
            )}

            <div className="flex flex-col gap-0.5">
                {sessions?.map(session => (
                    <SessionRow key={session.id} session={session} />
                ))}
            </div>
        </div>
    )
}
