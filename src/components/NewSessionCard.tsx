import { Card } from "flowbite-react";
import type { WorkoutSession } from "../types";
import { formatDuration, formatSessionDate } from "../utils/date";

interface NewSessionCardProps {
    session: WorkoutSession | undefined
    isLoading: boolean
    error: any
}

export default function NewSessionCard({session, isLoading, error}: NewSessionCardProps) {
    if (isLoading) {
        return <Card>
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg">
                <span className="sr-only">Loading...</span>
            </div>
        </Card>
    }

    if (error) {
        return <Card>
            <div className="text-red-500">Error loading last session</div>
        </Card>
    }

    if (!session) {
        return <Card>
            <p className="text-sm text-gray-400"> No sessions yet - start your first one below.</p>
        </Card>
    }
    return (
                <Card href="#">
                    <div className='flex items-center'>
                        <h2>{session?.workoutTemplateName}</h2>
                    </div>
                        <div className='flex items-center -mt-6'>
                            <h3>{formatSessionDate(session.startedAt)} - {formatDuration(session.durationSeconds)}</h3>
                        </div>
                </Card>
    )
}