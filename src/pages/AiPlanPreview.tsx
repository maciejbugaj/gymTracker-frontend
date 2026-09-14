import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGeneration, useRegenerate } from '../hooks/useAiPlanGeneration'
import { useCreateProgramFromGeneration } from '../hooks/useTrainingPrograms'
import { useAiPlanDraftStore } from '../stores/useAiPlanDraftStore'
import type { GeneratedProgram, TrainingProgramRequest } from '../types'
import Button from '../components/ui/Button'
import { INPUT_CLASS, LABEL_CLASS, NUMBER_INPUT_CLASS } from '../components/ui/form'

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
    'Reading your training history…',
    'Laying out the weekly structure…',
    'Balancing volume against recovery…',
    'Writing the progression notes…',
]

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
        return <div className="w-full px-4 pt-16 text-center text-[13px] text-steel">Loading…</div>
    }

    if (generation.status === 'PENDING') {
        return (
            <div className="flex w-full flex-col items-center gap-4 px-6 pb-24 pt-16 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <h1 className="font-condensed text-[24px] font-bold leading-none">Writing your block</h1>
                <p className="text-[13px] text-steel">{PENDING_MESSAGES[messageIndex]}</p>
            </div>
        )
    }

    if (generation.status === 'FAILED') {
        return (
            <div className="flex w-full flex-col items-center gap-4 px-6 pb-24 pt-16 text-center">
                <h1 className="font-condensed text-[24px] font-bold leading-none text-danger">The plan didn't finish</h1>
                <p className="max-w-xs text-[13px] text-steel">
                    {generation.errorMessage ?? 'Something broke while writing your program.'}
                </p>
                <Button onClick={() => navigate('/ai-plan')}>Start over</Button>
            </div>
        )
    }

    if (!draft) {
        return <div className="w-full px-4 pt-16 text-center text-[13px] text-steel">Loading…</div>
    }

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <h1 className="font-condensed text-[26px] font-bold leading-none">{draft.name}</h1>
                {draft.description && <p className="mt-1.5 text-[12.5px] text-steel">{draft.description}</p>}
                {(generation.inputTokens != null || generation.outputTokens != null) && (
                    <p className="mt-1 text-[11px] text-steel-dark">
                        {(generation.inputTokens ?? 0) + (generation.outputTokens ?? 0)} tokens
                        ({generation.inputTokens ?? 0} in / {generation.outputTokens ?? 0} out)
                    </p>
                )}
            </header>

            {draft.coachNotes && (
                <div className="border-l-[3px] border-plate-20 bg-platform-800 px-4 py-3">
                    <h2 className="mb-1 font-condensed text-[14px] font-semibold text-steel">Coach notes</h2>
                    <p className="text-[13px] text-chalk-dim">{draft.coachNotes}</p>
                </div>
            )}

            <div className="mt-2 flex flex-col gap-0.5">
                {draft.weeks.map((week, weekIndex) => (
                    <div key={week.weekNumber} className={week.isDeload ? 'border-l-[3px] border-accent bg-platform-800' : 'bg-platform-800'}>
                        <button
                            type="button"
                            aria-expanded={expandedWeek === weekIndex}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                            onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
                        >
                            <span className="font-condensed text-[16px] font-semibold">
                                Week {week.weekNumber}{week.focus ? ` — ${week.focus}` : ''}
                            </span>
                            {week.isDeload && (
                                <span className="shrink-0 bg-accent px-2 py-0.5 font-condensed text-[12px] font-semibold text-platform-900">Deload</span>
                            )}
                        </button>

                        {expandedWeek === weekIndex && (
                            <div className="flex flex-col gap-0.5 pb-0.5">
                                {week.days.map((day, dayIndex) => (
                                    <div key={day.dayNumber} className="bg-platform-750 px-4 py-3">
                                        <p className="mb-2 font-condensed text-[15px] font-semibold text-chalk-dim">
                                            Day {day.dayNumber}{day.name ? ` — ${day.name}` : ''}
                                        </p>
                                        <div className="flex flex-col gap-1.5">
                                            {day.exercises.map((exercise, exerciseIndex) => (
                                                <div key={exercise.sortOrder} className="flex items-center gap-2 text-[13px]">
                                                    <span className="min-w-0 flex-1 truncate text-chalk-dim">{exercise.exerciseName}</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetSets}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetSets: Number(e.target.value) })}
                                                        className={NUMBER_INPUT_CLASS}
                                                        aria-label={`${exercise.exerciseName} sets`}
                                                    />
                                                    <span className="text-steel-dark">×</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetRepsMin}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMin: Number(e.target.value) })}
                                                        className={NUMBER_INPUT_CLASS}
                                                        aria-label={`${exercise.exerciseName} min reps`}
                                                    />
                                                    <span className="text-steel-dark">–</span>
                                                    <input
                                                        type="number" min={1} value={exercise.targetRepsMax}
                                                        onChange={e => updateExercise(weekIndex, dayIndex, exerciseIndex, { targetRepsMax: Number(e.target.value) })}
                                                        className={NUMBER_INPUT_CLASS}
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

            <div className="flex flex-col gap-2 px-4 pt-4">
                {showRegenerateForm ? (
                    <div className="flex flex-col gap-3 bg-platform-800 px-4 py-4">
                        <div>
                            <label htmlFor="plan-feedback" className={LABEL_CLASS}>What should change?</label>
                            <textarea id="plan-feedback" value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} className={INPUT_CLASS} />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="solid" className="flex-1" onClick={handleRegenerate} disabled={!feedback.trim() || isRegenerating}>
                                {isRegenerating ? 'Rewriting…' : 'Rewrite the plan'}
                            </Button>
                            <Button variant="quiet" className="flex-1" onClick={() => setShowRegenerateForm(false)}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <Button variant="quiet" className="w-full" onClick={() => setShowRegenerateForm(true)}>Rewrite with notes</Button>
                )}

                <Button size="lg" className="w-full" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save program'}
                </Button>
            </div>
        </div>
    )
}
