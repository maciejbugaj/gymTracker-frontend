import type { WorkoutSession } from "../types";
import { formatDuration, formatSessionDate } from "../utils/date";

interface LastSessionCardProps {
    session: WorkoutSession | undefined
    isLoading: boolean
    error: Error | null
    description?: string
}

export default function LastSessionCard({ session, isLoading, error, description }: LastSessionCardProps) {
    if (isLoading) {
        return (
            <div className="h-[72px] animate-pulse bg-platform-800">
                <span className="sr-only">Loading your last session…</span>
            </div>
        )
    }

    if (error) {
        return (
            <div role="alert" className="bg-platform-800 px-4 py-3 text-[13px] text-danger">
                Your last session didn't load. Try again in a moment.
            </div>
        )
    }

    if (!session) {
        return (
            <div className="bg-platform-800 px-4 py-3 text-[13px] text-steel">
                Nothing logged yet. Pick a session below and start your first one.
            </div>
        )
    }

    const logs = session.exerciseLogs ?? []
    const totalSets = logs.length
    const tonnage = logs.reduce((sum, log) => sum + (log.reps ?? 0) * (log.weightKg ?? 0), 0)

    return (
        <div className="bg-platform-800 px-4 py-3">
            <p className="font-condensed text-[16px] font-semibold leading-tight">
                {session.workoutTemplateName ?? session.dayName}
            </p>
            {description && <p className="mt-0.5 text-[11.5px] text-steel">{description}</p>}
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11.5px] text-steel">
                <span>{formatSessionDate(session.startedAt)}</span>
                <span>
                    <span className="font-medium text-chalk-dim">{formatDuration(session.durationSeconds ?? 0)}</span>
                </span>
                {totalSets > 0 && (
                    <span>
                        <span className="font-medium text-chalk-dim">{totalSets}</span> {totalSets === 1 ? 'set' : 'sets'}
                    </span>
                )}
                {tonnage > 0 && (
                    <span>
                        <span className="font-medium text-chalk-dim">{tonnage.toLocaleString()}</span> kg total
                    </span>
                )}
            </p>
        </div>
    )
}
