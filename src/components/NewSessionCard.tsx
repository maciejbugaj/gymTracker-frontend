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
        return (
            <div className="h-[72px] animate-pulse bg-platform-800">
                <span className="sr-only">Loading templates…</span>
            </div>
        )
    }

    if (error) {
        return (
            <div role="alert" className="bg-platform-800 px-4 py-3 text-[13px] text-danger">
                Templates didn't load. Pull to refresh or try again in a moment.
            </div>
        )
    }

    if (!template) {
        return (
            <div className="bg-platform-800 px-4 py-3 text-[13px] text-steel">
                No templates yet. Create one under Templates to start a session.
            </div>
        )
    }

    return (
        <button
            type="button"
            aria-pressed={isSelected}
            onClick={() => setWorkoutTemplateToStart?.(template)}
            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                isSelected
                    ? 'border-l-[3px] border-accent bg-platform-700 pl-[13px]'
                    : 'bg-platform-800 hover:bg-platform-750'
            }`}
        >
            <span className="min-w-0 flex-1">
                <span className="block font-condensed text-[16px] font-semibold leading-tight">{template.name}</span>
                {template.description && (
                    <span className="mt-0.5 block text-[11.5px] text-steel">{template.description}</span>
                )}
                <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {template.exercises.map(exercise => (
                        <span key={exercise.id} className="bg-platform-600 px-1.5 py-0.5 text-[10.5px] text-chalk-dim">
                            {exercise.exerciseName}
                        </span>
                    ))}
                </span>
            </span>
            <span
                aria-hidden="true"
                className={`h-[17px] w-[17px] shrink-0 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-accent bg-accent ring-3 ring-inset ring-platform-700' : 'border-platform-400'
                }`}
            />
        </button>
    )
}
