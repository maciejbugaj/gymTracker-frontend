import { useState } from "react"
import { Button } from "flowbite-react"
import TemplateCard from "../components/TemplateCard"
import { useWorkoutTemplates, useCreateWorkoutTemplate } from "../hooks/useWorkoutTemplates"

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
        <div className='w-full px-4 pb-16'>
            <div className='p-4'>
                <h1>Templates</h1>
                <p className="text-gray-500 text-sm">Manage your workout templates</p>
            </div>
            <div className='grid'>
                <div className="mt-2 mb-3 flex items-center justify-between">
                    <h2>Your Templates</h2>
                    <Button size="xs" color="purple" onClick={() => setShowForm(v => !v)}>
                        {showForm ? 'Cancel' : '+ New Template'}
                    </Button>
                </div>

                {showForm && (
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 mb-4">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3">New Template</h3>
                        <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-1">Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Push Day"
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-gray-400 mb-1">Description (optional)</label>
                            <input
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="e.g. Chest, shoulders, triceps"
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
                            />
                        </div>
                        <Button
                            size="sm"
                            color="purple"
                            onClick={handleCreate}
                            disabled={!name.trim() || createTemplate.isPending}
                            className="w-full"
                        >
                            Create &amp; Add Exercises
                        </Button>
                    </div>
                )}

                {workoutTemplates?.map(template => (
                    <TemplateCard template={template} isLoading={isLoadingTemplates} error={errorTemplates} key={template.id} />
                ))}
            </div>
        </div>
    )
}
