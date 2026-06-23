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
    return (
        <Card>
            <div className='flex items-center -mb-5'>
                <h2>{session.workoutTemplateName}</h2>
            </div>
            {description && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 -mt-8 text-left">{description}</p>
            )}
            <div className='flex items-center text-xs -mt-3 sm:text-sm md:text-lg'>
                <h3>{formatSessionDate(session.startedAt)} - {formatDuration(session.durationSeconds ?? 0)}</h3>
            </div>
        </Card>
    )
}