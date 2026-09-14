import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { useGeneration, useRegenerate } from '../hooks/useAiPlanGeneration'
import { useCreateProgramFromGeneration } from '../hooks/useTrainingPrograms'
import { useAiPlanDraftStore } from '../stores/useAiPlanDraftStore'
import type { GeneratedProgram, TrainingProgramRequest } from '../types'

// GeneratedWeek/Day/Exercise are structurally identical to ProgramWeek/Day/ExerciseRequest,
// so this is just dropping the AI-only fields (coachNotes) rather than remapping every level.
function toProgramRequest(program: GeneratedProgram): TrainingProgramRequest {
    return {
        name: program.name,
        description: program.description,
        goal: program.goal,
        durationWeeks: program.durationWeeks,
        daysPerWeek: program.daysPerWeek,
        weeks: program.weeks,
    }
}

const PENDING_MESSAGES = [
    'Reviewing your training history…',
    'Designing the weekly structure…',
    'Balancing volume and recovery…',
    'Writing progression notes…',
]

const inputClass = "w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"

export default function AiPlanPreview() {
    const { generationId } = useParams<{ generationId: string }>()
    const id = generationId ? parseInt(generationId, 10) : undefined
    const navigate = useNavigate()

    const { data: generation, isLoading } = useGeneration(id)
    const { mutate: regenerate, isPending: isRegenerating } = useRegenerate()
    const { mutate: saveProgram, isPending: isSaving } = useCreateProgramFromGeneration()

    const draft = useAiPlanDraftStore(s => s.draft)
    const loadDraft = useAiPlanDraftStore(s => s.loadDraft)
    const updateExercise = useAiPlanDraftStore(s => s.updateExercise)

    const [expandedWeek, setExpandedWeek] = useState<number | null>(0)
    const [feedback, setFeedback] = useState('')
    const [showRegenerateForm, setShowRegenerateForm] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)

    // React Router reuses this component when only :generationId changes (e.g. after
    // regenerate navigates to a new id) — track which id the draft was loaded for so we
    // reload it instead of showing a stale draft from the previous generation.
    const loadedIdRef = useRef<number | undefined>(undefined)
    useEffect(() => {
        if (generation?.status === 'SUCCEEDED' && generation.program && loadedIdRef.current !== id) {
            loadDraft(generation.program)
            loadedIdRef.current = id
        }
    }, [generation, id, loadDraft])

    useEffect(() => {
        if (generation?.status !== 'PENDING') return
        const interval = setInterval(() => setMessageIndex(i => (i + 1) % PENDING_MESSAGES.length), 2500)
        return () => clearInterval(interval)
    }, [generation?.status])

    function handleRegenerate() {
        if (!id || !feedback.trim()) return
        regenerate({ id, feedback: feedback.trim() })
    }

    function handleSave() {
        if (!id || !draft) return
        saveProgram({ generationId: id, data: toProgramRequest(draft) })
    }

    if (isLoading || !generation) {
        return <div className="w-full px-4 pt-16 text-center text-gray-500">Loading…</div>
    }

    if (generation.status === 'PENDING') {
        return (
            <div className="w-full px-4 pt-16 pb-24 flex flex-col items-center text-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <h1>Building your program…</h1>
                <p className="text-gray-400 text-sm">{PENDING_MESSAGES[messageIndex]}</p>
            </div>
        )
    }

    if (generation.status === 'FAILED') {
        return (
            <div className="w-full px-4 pt-16 pb-24 flex flex-col items-center text-center gap-4">
                <h1 className="text-red-400">Generation failed</h1>
                <p className="text-gray-400 text-sm max-w-xs">
                    {generation.errorMessage ?? 'Something went wrong while generating your program.'}
                </p>
                <Button color="purple" onClick={() => navigate('/ai-plan')}>Try again</Button>
            </div>
        )
    }

    if (!draft) {
        return <div className="w-full px-4 pt-16 text-center text-gray-500">Loading…</div>
    }

    return (
        <div className="w-full px-4 pb-24 pt-2">
            <div className="px-2 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-1">AI Coach</p>
                <h1>{draft.name}</h1>
                {draft.description && <p className="text-gray-500 text-sm mt-1">{draft.description}</p>}
            </div>

            {draft.coachNotes && (
                <div className="rounded-xl bg-gray-800 border border-violet-500/30 p-4 mb-4">
                    <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-1">Coach notes</h3>
                    <p className="text-sm text-gray-300">{draft.coachNotes}</p>
                </div>
            )}

            <div className="flex flex-col gap-2 mb-4">
                {draft.weeks.map((week, weekIndex) => (
                    <div key={week.weekNumber} className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
                            onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
                        >
                            <span className="text-sm font-medium text-gray-100">
                                Week {week.weekNumber}{week.focus ? ` · ${week.focus}` : ''}
                            </span>
                            {week.isDeload && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Deload</span>
                            )}
                        </button>
                        {expandedWeek === weekIndex && (
                            <div className="px-4 pb-4 flex flex-col gap-3">
                                {week.days.map((day, dayIndex) => (
                                    <div key={day.dayNumber} className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
                                        <p className="text-sm font-medium text-gray-200 mb-2">
                                            Day {day.dayNumber}{day.name ? ` · ${day.name}` : ''}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {day.exercises.map((exercise, exerciseIndex) => (
                                                <div key={exercise.sortOrder} className="flex items-center gap-2">
                                                    <span className="flex-1 text-sm text-gray-300 truncate">{exercise.exerciseName}</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetSets}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetSets: Number(e.target.value) })}
                                                        className="w-12 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                        aria-label={`${exercise.exerciseName} sets`}
                                                    />
                                                    <span className="text-gray-500 text-xs">×</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetRepsMin}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMin: Number(e.target.value) })}
                                                        className="w-12 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                        aria-label={`${exercise.exerciseName} min reps`}
                                                    />
                                                    <span className="text-gray-500 text-xs">–</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetRepsMax}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMax: Number(e.target.value) })}
                                                        className="w-12 text-center bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                                                        aria-label={`${exercise.exerciseName} max reps`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showRegenerateForm ? (
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 mb-4">
                    <label className="block text-xs text-gray-400 mb-1">What would you like to change?</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} className={`${inputClass} mb-3`} />
                    <div className="flex gap-2">
                        <Button color="alternative" className="flex-1" onClick={() => setShowRegenerateForm(false)}>Cancel</Button>
                        <Button color="purple" className="flex-1" onClick={handleRegenerate} disabled={!feedback.trim() || isRegenerating}>
                            {isRegenerating ? 'Regenerating…' : 'Regenerate'}
                        </Button>
                    </div>
                </div>
            ) : (
                <Button color="alternative" className="w-full mb-2" onClick={() => setShowRegenerateForm(true)}>Regenerate with notes</Button>
            )}

            <Button color="purple" size="lg" className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Program'}
            </Button>
        </div>
    )
}
