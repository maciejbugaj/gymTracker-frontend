import { Card } from "flowbite-react";
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
        return <Card>
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg">
                <span className="sr-only">Loading…</span>
            </div>
        </Card>
    }

    if (error) {
        return <Card>
            <div role="alert" className="text-red-500">Error loading last session</div>
        </Card>
    }

    if (!session) {
        return <Card>
            <p className="text-sm text-gray-400">No sessions yet - start your first one below.</p>
        </Card>
    }

    const totalSets = session.exerciseLogs?.length ?? 0

    return (
        <Card>
            <div className="text-left">
                <h2 className="text-base font-semibold text-gray-100 tracking-tight normal-case mb-1">
                    {session.workoutTemplateName ?? session.dayName}
                </h2>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span>{formatSessionDate(session.startedAt)}</span>
                    <span aria-hidden="true" className="text-gray-600">·</span>
                    <span>⏱ {formatDuration(session.durationSeconds ?? 0)}</span>
                    {totalSets > 0 && (
                        <>
                            <span aria-hidden="true" className="text-gray-600">·</span>
                            <span>🏋 {totalSets} {totalSets === 1 ? 'set' : 'sets'}</span>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}
