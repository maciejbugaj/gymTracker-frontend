import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { useWorkoutTemplateById, useUpdateWorkoutTemplate, useWorkoutTemplates } from '../hooks/useWorkoutTemplates'
import { useCreateTemplateExercise, useUpdateTemplateExercise, useDeleteTemplateExercise } from '../hooks/useTemplateExercises'
import type { TemplateExercise, WorkoutTemplate } from '../types'

type ExerciseFormValues = {
    exerciseName: string
    defaultSets: string
    defaultReps: string
    defaultWeight: string
}

const emptyForm: ExerciseFormValues = { exerciseName: '', defaultSets: '', defaultReps: '', defaultWeight: '' }

function toNum(val: string): number | undefined {
    const n = parseFloat(val)
    return isNaN(n) ? undefined : n
}

function exerciseToForm(exercise: TemplateExercise): ExerciseFormValues {
    return {
        exerciseName: exercise.exerciseName,
        defaultSets: String(exercise.defaultSets ?? ''),
        defaultReps: String(exercise.defaultReps ?? ''),
        defaultWeight: String(exercise.defaultWeight ?? ''),
    }
}

function EditTemplateForm({ template }: { template: WorkoutTemplate }) {
    const navigate = useNavigate()
    const updateTemplate = useUpdateWorkoutTemplate()
    const createExercise = useCreateTemplateExercise()
    const updateExercise = useUpdateTemplateExercise()
    const deleteExercise = useDeleteTemplateExercise()

    const { data: allTemplates } = useWorkoutTemplates()

    // Map of exercise name → default values gathered from all templates
    const exerciseSuggestions = useMemo(() => {
        const map = new Map<string, { defaultSets?: number; defaultReps?: number; defaultWeight?: number }>()
        for (const t of allTemplates ?? []) {
            for (const ex of t.exercises) {
                if (!map.has(ex.exerciseName)) {
                    map.set(ex.exerciseName, {
                        defaultSets: ex.defaultSets,
                        defaultReps: ex.defaultReps,
                        defaultWeight: ex.defaultWeight,
                    })
                }
            }
        }
        return map
    }, [allTemplates])

    const [templateName, setTemplateName] = useState(template.name)
    const [templateDescription, setTemplateDescription] = useState(template.description ?? '')
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<ExerciseFormValues>(emptyForm)
    const [addForm, setAddForm] = useState<ExerciseFormValues>(emptyForm)

    function handleExpand(exercise: TemplateExercise) {
        setExpandedId(exercise.id)
        setEditForm(exerciseToForm(exercise))
    }

    function handleSaveExercise(exercise: TemplateExercise) {
        updateExercise.mutate(
            {
                id: exercise.id,
                data: {
                    workoutTemplateId: template.id,
                    exerciseName: editForm.exerciseName,
                    defaultSets: toNum(editForm.defaultSets),
                    defaultReps: toNum(editForm.defaultReps),
                    defaultWeightKg: toNum(editForm.defaultWeight),
                    sortOrder: exercise.sortOrder,
                },
            },
            { onSuccess: () => setExpandedId(null) }
        )
    }

    function handleDeleteExercise(exerciseId: number) {
        deleteExercise.mutate({ id: exerciseId, templateId: template.id })
    }

    function handleAddExercise() {
        if (!addForm.exerciseName.trim()) return
        createExercise.mutate(
            {
                workoutTemplateId: template.id,
                exerciseName: addForm.exerciseName.trim(),
                defaultSets: toNum(addForm.defaultSets),
                defaultReps: toNum(addForm.defaultReps),
                defaultWeightKg: toNum(addForm.defaultWeight),
                sortOrder: template.exercises.length,
            },
            { onSuccess: () => setAddForm(emptyForm) }
        )
    }

    function handleSaveTemplate() {
        if (!templateName.trim()) return
        updateTemplate.mutate(
            { id: template.id, data: { name: templateName.trim(), description: templateDescription || undefined } },
            { onSuccess: () => navigate('/templates') }
        )
    }

    return (
        <div className="w-full px-4 pb-24 pt-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pt-2">
                <button
                    onClick={() => navigate('/templates')}
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                >
                    ← Back
                </button>
                <h1 className="text-lg font-semibold">Edit Template</h1>
            </div>

            {/* Template info */}
            <div className="rounded-xl bg-gray-800 p-4 mb-4 border border-gray-700">
                <label className="block text-xs text-gray-400 mb-1">Template name</label>
                <input
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <input
                    value={templateDescription}
                    onChange={e => setTemplateDescription(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>

            {/* Exercises */}
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Exercises</h2>
                <div className="flex flex-col gap-2">
                    {template.exercises.map(exercise => (
                        <div key={exercise.id} className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                            {expandedId === exercise.id ? (
                                <div className="p-4">
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-400 mb-1">Exercise name</label>
                                        <input
                                            value={editForm.exerciseName}
                                            onChange={e => setEditForm(f => ({ ...f, exerciseName: e.target.value }))}
                                            className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {(['defaultSets', 'defaultReps', 'defaultWeight'] as const).map((field, i) => (
                                            <div key={field}>
                                                <label className="block text-xs text-gray-400 mb-1">
                                                    {['Sets', 'Reps', 'Weight (kg)'][i]}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editForm[field]}
                                                    onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                                    className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button size="xs" color="alternative" onClick={() => setExpandedId(null)}>Cancel</Button>
                                        <Button
                                            size="xs"
                                            color="purple"
                                            onClick={() => handleSaveExercise(exercise)}
                                            isProcessing={updateExercise.isPending}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={() => handleExpand(exercise)}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-100">{exercise.exerciseName}</p>
                                        <p className="text-xs text-gray-400">
                                            {exercise.defaultSets} sets · {exercise.defaultReps} reps · {exercise.defaultWeight} kg
                                        </p>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDeleteExercise(exercise.id) }}
                                        className="text-gray-500 hover:text-red-400 transition-colors ml-3 text-lg leading-none"
                                        aria-label="Delete exercise"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add exercise */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Add Exercise</h3>
                <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">Exercise name</label>
                    <datalist id="exercise-suggestions">
                        {Array.from(exerciseSuggestions.keys()).map(name => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                    <input
                        list="exercise-suggestions"
                        value={addForm.exerciseName}
                        onChange={e => {
                            const name = e.target.value
                            const suggestion = exerciseSuggestions.get(name)
                            if (suggestion) {
                                setAddForm({
                                    exerciseName: name,
                                    defaultSets: String(suggestion.defaultSets ?? ''),
                                    defaultReps: String(suggestion.defaultReps ?? ''),
                                    defaultWeight: String(suggestion.defaultWeight ?? ''),
                                })
                            } else {
                                setAddForm(f => ({ ...f, exerciseName: name }))
                            }
                        }}
                        placeholder="e.g. Bench Press"
                        className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {(['defaultSets', 'defaultReps', 'defaultWeight'] as const).map((field, i) => (
                        <div key={field}>
                            <label className="block text-xs text-gray-400 mb-1">
                                {['Sets', 'Reps', 'Weight (kg)'][i]}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={addForm[field]}
                                onChange={e => setAddForm(f => ({ ...f, [field]: e.target.value }))}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    size="sm"
                    color="purple"
                    onClick={handleAddExercise}
                    disabled={!addForm.exerciseName.trim()}
                    isProcessing={createExercise.isPending}
                    className="w-full"
                >
                    + Add Exercise
                </Button>
            </div>

            {/* Save template */}
            <Button
                color="purple"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                isProcessing={updateTemplate.isPending}
                className="w-full"
            >
                Save Template
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">All changes are saved to your template.</p>
        </div>
    )
}

export default function EditTemplate() {
    const { id } = useParams<{ id: string }>()
    const templateId = id ? parseInt(id, 10) : undefined
    const { data: template, isLoading, error } = useWorkoutTemplateById(templateId)

    if (isLoading) {
        return (
            <div className="w-full px-4 pb-20 pt-4">
                <div className="h-8 bg-gray-700 animate-pulse rounded mb-4 w-1/2" />
                <div className="h-32 bg-gray-700 animate-pulse rounded" />
            </div>
        )
    }

    if (error || !template) {
        return (
            <div className="w-full px-4 pb-20 pt-4">
                <p className="text-red-400">Failed to load template.</p>
            </div>
        )
    }

    return <EditTemplateForm key={template.id} template={template} />
}
