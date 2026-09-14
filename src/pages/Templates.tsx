import { useState } from "react"
import TemplateCard from "../components/TemplateCard"
import { useWorkoutTemplates, useCreateWorkoutTemplate } from "../hooks/useWorkoutTemplates"
import Button from "../components/ui/Button"
import { INPUT_CLASS, LABEL_CLASS } from "../components/ui/form"

export default function Templates() {
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()
    const createTemplate = useCreateWorkoutTemplate()

    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    function handleCreate() {
        if (!name.trim()) return
        createTemplate.mutate(
            { name: name.trim(), description: description.trim() || undefined },
            { onSuccess: () => { setShowForm(false); setName(''); setDescription('') } }
        )
    }

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <h1 className="font-condensed text-[26px] font-bold leading-none">Templates</h1>
                <p className="mt-1 text-[12.5px] text-steel">Your own sessions, reused every week.</p>
            </header>

            <div className="flex items-center justify-between px-4 pb-2 pt-3">
                <h2 className="font-condensed text-[14px] font-semibold text-steel">Your templates</h2>
                <Button variant={showForm ? 'quiet' : 'solid'} size="sm" onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Cancel' : 'New template'}
                </Button>
            </div>

            {showForm && (
                <div className="mb-2 flex flex-col gap-3 bg-platform-800 px-4 py-4">
                    <div>
                        <label htmlFor="template-name" className={LABEL_CLASS}>Name</label>
                        <input
                            id="template-name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Push A"
                            className={INPUT_CLASS}
                        />
                    </div>
                    <div>
                        <label htmlFor="template-description" className={LABEL_CLASS}>Description (optional)</label>
                        <input
                            id="template-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="e.g. Chest, shoulders, triceps"
                            className={INPUT_CLASS}
                        />
                    </div>
                    <Button
                        size="md"
                        className="w-full"
                        onClick={handleCreate}
                        disabled={!name.trim() || createTemplate.isPending}
                    >
                        {createTemplate.isPending ? 'Creating…' : 'Create and add exercises'}
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-0.5">
                {workoutTemplates?.map(template => (
                    <TemplateCard template={template} isLoading={isLoadingTemplates} error={errorTemplates} key={template.id} />
                ))}
                {(isLoadingTemplates || errorTemplates || workoutTemplates?.length === 0) && (
                    <TemplateCard template={undefined} isLoading={isLoadingTemplates} error={errorTemplates} />
                )}
            </div>
        </div>
    )
}
