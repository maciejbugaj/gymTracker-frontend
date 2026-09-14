import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutTemplateById, useUpdateWorkoutTemplate, useWorkoutTemplates } from '../hooks/useWorkoutTemplates'
import { useCreateTemplateExercise, useUpdateTemplateExercise, useDeleteTemplateExercise } from '../hooks/useTemplateExercises'
import type { TemplateExercise, WorkoutTemplate } from '../types'
import Button from '../components/ui/Button'
import { INPUT_CLASS, LABEL_CLASS } from '../components/ui/form'

type ExerciseFormValues = {
    exerciseName: string
    defaultSets: string
    defaultReps: string
    defaultWeight: string
}

const emptyForm: ExerciseFormValues = { exerciseName: '', defaultSets: '', defaultReps: '', defaultWeight: '' }

const NUMBER_FIELDS = [
    { field: 'defaultSets', label: 'Sets' },
    { field: 'defaultReps', label: 'Reps' },
    { field: 'defaultWeight', label: 'Weight (kg)' },
] as const

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
        <div className="w-full pb-24">
            <div className="px-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/templates')}
                    className="cursor-pointer font-condensed text-[13px] font-semibold text-steel transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    ← Templates
                </button>
            </div>

            <header className="px-4 pb-3 pt-3">
                <h1 className="font-condensed text-[26px] font-bold leading-none">{template.name}</h1>
                <p className="mt-1 text-[12.5px] text-steel">Rename it, then add the exercises you do in order.</p>
            </header>

            <div className="flex flex-col gap-3 bg-platform-800 px-4 py-4">
                <div>
                    <label htmlFor="edit-template-name" className={LABEL_CLASS}>Template name</label>
                    <input
                        id="edit-template-name"
                        value={templateName}
                        onChange={e => setTemplateName(e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>
                <div>
                    <label htmlFor="edit-template-description" className={LABEL_CLASS}>Description</label>
                    <input
                        id="edit-template-description"
                        value={templateDescription}
                        onChange={e => setTemplateDescription(e.target.value)}
                        className={INPUT_CLASS}
                    />
                </div>
            </div>

            <h2 className="px-4 pb-2 pt-5 font-condensed text-[14px] font-semibold text-steel">Exercises</h2>
            <div className="flex flex-col gap-0.5">
                {template.exercises.length === 0 && (
                    <p className="bg-platform-800 px-4 py-3 text-[13px] text-steel">
                        No exercises yet. Add the first one below.
                    </p>
                )}
                {template.exercises.map(exercise => (
                    <div key={exercise.id} className="bg-platform-800">
                        {expandedId === exercise.id ? (
                            <div className="flex flex-col gap-3 px-4 py-4">
                                <div>
                                    <label htmlFor={`exercise-name-${exercise.id}`} className={LABEL_CLASS}>Exercise name</label>
                                    <input
                                        id={`exercise-name-${exercise.id}`}
                                        value={editForm.exerciseName}
                                        onChange={e => setEditForm(f => ({ ...f, exerciseName: e.target.value }))}
                                        className={INPUT_CLASS}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {NUMBER_FIELDS.map(({ field, label }) => (
                                        <div key={field}>
                                            <label htmlFor={`${field}-${exercise.id}`} className={LABEL_CLASS}>{label}</label>
                                            <input
                                                id={`${field}-${exercise.id}`}
                                                type="number"
                                                min="0"
                                                value={editForm[field]}
                                                onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                                className={INPUT_CLASS}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleSaveExercise(exercise)}
                                        disabled={updateExercise.isPending}
                                    >
                                        {updateExercise.isPending ? 'Saving…' : 'Save exercise'}
                                    </Button>
                                    <Button size="sm" variant="quiet" onClick={() => setExpandedId(null)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3 px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => handleExpand(exercise)}
                                    className="min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <span className="block font-condensed text-[16px] font-semibold leading-tight">{exercise.exerciseName}</span>
                                    <span className="mt-0.5 block text-[11.5px] text-steel">
                                        {exercise.defaultSets ?? '—'} × {exercise.defaultReps ?? '—'} at {exercise.defaultWeight ?? '—'} kg
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteExercise(exercise.id)}
                                    className="shrink-0 cursor-pointer text-[20px] leading-none text-steel-dark transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                    aria-label={`Remove ${exercise.exerciseName}`}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="px-4 pb-2 pt-5 font-condensed text-[14px] font-semibold text-steel">Add an exercise</h2>
            <div className="flex flex-col gap-3 bg-platform-800 px-4 py-4">
                <div>
                    <label htmlFor="add-exercise-name" className={LABEL_CLASS}>Exercise name</label>
                    <datalist id="exercise-suggestions">
                        {Array.from(exerciseSuggestions.keys()).map(name => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                    <input
                        id="add-exercise-name"
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
                        className={INPUT_CLASS}
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {NUMBER_FIELDS.map(({ field, label }) => (
                        <div key={field}>
                            <label htmlFor={`add-${field}`} className={LABEL_CLASS}>{label}</label>
                            <input
                                id={`add-${field}`}
                                type="number"
                                min="0"
                                value={addForm[field]}
                                onChange={e => setAddForm(f => ({ ...f, [field]: e.target.value }))}
                                className={INPUT_CLASS}
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    onClick={handleAddExercise}
                    disabled={!addForm.exerciseName.trim() || createExercise.isPending}
                >
                    {createExercise.isPending ? 'Adding…' : 'Add exercise'}
                </Button>
            </div>

            <div className="px-4 pt-5">
                <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim() || updateTemplate.isPending}
                >
                    {updateTemplate.isPending ? 'Saving…' : 'Save template'}
                </Button>
            </div>
        </div>
    )
}

export default function EditTemplate() {
    const { id } = useParams<{ id: string }>()
    const templateId = id ? parseInt(id, 10) : undefined
    const { data: template, isLoading, error } = useWorkoutTemplateById(templateId)

    if (isLoading) {
        return (
            <div className="w-full px-4 pt-6">
                <div className="mb-4 h-8 w-1/2 animate-pulse bg-platform-800" />
                <div className="h-32 animate-pulse bg-platform-800" />
                <span className="sr-only">Loading template…</span>
            </div>
        )
    }

    if (error || !template) {
        return (
            <div role="alert" className="w-full px-4 pt-16 text-center text-[13px] text-danger">
                This template didn't load. Go back to Templates and open it again.
            </div>
        )
    }

    return <EditTemplateForm key={template.id} template={template} />
}
