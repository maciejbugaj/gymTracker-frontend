import { useState } from "react";
import { Button, Card } from "flowbite-react";
import type { WorkoutTemplate } from "../types";

interface TemplateCardProps {
    template: WorkoutTemplate | undefined
    isLoading: boolean
    error: Error | null
}

export default function TemplateCard({ template, isLoading, error }: TemplateCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)

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
        <Card className="mt-2 mb-2">
            <div className="flex justify-between items-start gap-4">
                <div className="text-left">
                    <h2>{template.name}</h2>
                    <p className="text-xs sm:text-sm md:text-lg text-gray-500">{template.exercises.length} exercises</p>
                    <p className="text-xs sm:text-sm md:text-lg text-gray-500">{template?.description}</p>
                </div>
                <div className="flex-shrink-0">
                    {!confirmDelete ? (
                        <div className="flex gap-2">
                            <Button color="alternative" size="sm" onClick={() => { }}>Edit</Button>
                            <Button color="red" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button color="red" size="sm" onClick={() => { }}>Confirm Delete</Button>
                            <Button color="alternative" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}