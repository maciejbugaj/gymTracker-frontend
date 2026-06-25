import { Card } from "flowbite-react";
import type { WorkoutTemplate } from "../types";

interface NewSessionCardProps {
    template: WorkoutTemplate | undefined
    isLoading: boolean
    error: Error | null
    isSelected?: boolean
    setWorkoutTemplateToStart?: (template: WorkoutTemplate) => void
}

export default function NewSessionCard({ template, isLoading, error, isSelected = false, setWorkoutTemplateToStart }: NewSessionCardProps) {
    if (isLoading) {
        return <Card>
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg">
                <span className="sr-only">Loading…</span>
            </div>
        </Card>
    }

    if (error) {
        return <Card>
            <div role="alert" className="text-red-500">Error loading templates</div>
        </Card>
    }

    if (!template) {
        return <Card>
            <p className="text-sm text-gray-400">No templates created - create first template.</p>
        </Card>
    }

    return (
        <button
            type="button"
            aria-pressed={isSelected}
            onClick={() => setWorkoutTemplateToStart?.(template)}
            className={`w-full text-left mt-2 mb-2 rounded-lg border p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                isSelected
                    ? 'border-violet-500 ring-2 ring-violet-500/20 bg-violet-950/20 dark:bg-violet-950/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
        >
            <div className='flex items-center justify-between'>
                <h2 className={isSelected ? 'text-violet-300' : ''}>{template.name}</h2>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-violet-500 bg-violet-500' : 'border-gray-500 dark:border-gray-600'
                }`}>
                    {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-1.5">
                {template.exercises.map(ex => (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 whitespace-nowrap" key={ex.id}>
                        {ex.exerciseName}
                    </span>
                ))}
            </div>
        </button>
    )
}