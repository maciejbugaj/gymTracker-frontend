import { Card, Radio } from "flowbite-react";
import type { WorkoutTemplate } from "../types";

interface NewSessionCardProps {
    template: WorkoutTemplate | undefined
    isLoading: boolean
    error: any
    setWorkoutTemplateToStart?: (template: WorkoutTemplate) => void
}

export default function NewSessionCard({ template, isLoading, error, setWorkoutTemplateToStart }: NewSessionCardProps) {
    if (isLoading) {
        return <Card>
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg">
                <span className="sr-only">Loading...</span>
            </div>
        </Card>
    }

    if (error) {
        return <Card>
            <div className="text-red-500">Error loading templates</div>
        </Card>
    }

    if (!template) {
        return <Card>
            <p className="text-sm text-gray-400"> No templates created - create first template.</p>
        </Card>
    }
    return (
        <Card className="mt-2 mb-2">
            <div className='flex items-center justify-between'>
                <h2>{template?.name}</h2>
                <Radio className="h-8 w-8" color="lime" id={`${template.id}`} name="newSessionId" onChange={() => setWorkoutTemplateToStart(template)}/>
            </div>
            <div className='flex items-center -mt-6'>
                <h3>{template?.description}</h3>
            </div>
            <div className="flex flex-row gap-2">
                {template.exercises.map(ex => (
                    <div className="font-thin rounded-lg bg-gray-50 p-3 text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500" key={ex.id}>
                        {ex.exerciseName}
                    </div>
                ))}
            </div>
        </Card>
    )
}