import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkoutTemplate } from "../types";
import { useDeleteWorkoutTemplate } from "../hooks/useWorkoutTemplates";
import Button from "./ui/Button";

interface TemplateCardProps {
    template: WorkoutTemplate | undefined
    isLoading: boolean
    error: Error | null
}

export default function TemplateCard({ template, isLoading, error }: TemplateCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const navigate = useNavigate()
    const deleteTemplate = useDeleteWorkoutTemplate()

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
                Templates didn't load. Try again in a moment.
            </div>
        )
    }

    if (!template) {
        return (
            <div className="bg-platform-800 px-4 py-3 text-[13px] text-steel">
                No templates yet. Create your first one above.
            </div>
        )
    }

    return (
        <div className="flex items-start justify-between gap-3 bg-platform-800 px-4 py-3">
            <div className="min-w-0">
                <p className="font-condensed text-[16px] font-semibold leading-tight">{template.name}</p>
                <p className="mt-0.5 text-[11.5px] text-steel">
                    <span className="font-medium text-chalk-dim">{template.exercises.length}</span>
                    {template.exercises.length === 1 ? ' exercise' : ' exercises'}
                    {template.description ? ` · ${template.description}` : ''}
                </p>
            </div>
            <div className="flex shrink-0 gap-2">
                {!confirmDelete ? (
                    <>
                        <Button variant="quiet" size="sm" onClick={() => navigate(`/templates/${template.id}/edit`)}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
                    </>
                ) : (
                    <>
                        <Button variant="danger" size="sm" disabled={deleteTemplate.isPending} onClick={() => deleteTemplate.mutate(template.id)}>
                            {deleteTemplate.isPending ? 'Deleting…' : 'Confirm delete'}
                        </Button>
                        <Button variant="quiet" size="sm" onClick={() => setConfirmDelete(false)}>Keep</Button>
                    </>
                )}
            </div>
        </div>
    )
}
