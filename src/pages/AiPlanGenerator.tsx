import { useState } from 'react'
import { useStartGeneration } from '../hooks/useAiPlanGeneration'
import { useSessions } from '../hooks/useSessions'
import type { GeneratePlanRequest, ProgramGoal } from '../types'
import Button from '../components/ui/Button'
import { INPUT_CLASS, LABEL_CLASS } from '../components/ui/form'

function toList(value: string): string[] | undefined {
    const items = value.split(',').map(s => s.trim()).filter(Boolean)
    return items.length ? items : undefined
}

export default function AiPlanGenerator() {
    const { data: sessions } = useSessions()
    const { mutate: startGeneration, isPending, error } = useStartGeneration()

    const [goal, setGoal] = useState<ProgramGoal>('GENERAL')
    const [experienceLevel, setExperienceLevel] = useState('')
    const [daysPerWeek, setDaysPerWeek] = useState(4)
    const [durationWeeks, setDurationWeeks] = useState(8)
    const [sessionLengthMinutes, setSessionLengthMinutes] = useState(60)
    const [equipment, setEquipment] = useState('')
    const [splitPreference, setSplitPreference] = useState('')
    const [focusMuscleGroups, setFocusMuscleGroups] = useState('')
    const [exclusionsOrInjuries, setExclusionsOrInjuries] = useState('')
    const [notes, setNotes] = useState('')

    function handleSubmit() {
        const request: GeneratePlanRequest = {
            goal,
            experienceLevel: experienceLevel.trim() || undefined,
            daysPerWeek,
            durationWeeks,
            sessionLengthMinutes,
            equipment: toList(equipment),
            splitPreference: splitPreference.trim() || undefined,
            focusMuscleGroups: toList(focusMuscleGroups),
            exclusionsOrInjuries: exclusionsOrInjuries.trim() || undefined,
            notes: notes.trim() || undefined,
        }
        startGeneration(request)
    }

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <h1 className="font-condensed text-[26px] font-bold leading-none">New training block</h1>
                <p className="mt-1.5 text-[12.5px] text-steel">
                    Tell it your goal and it writes a periodized program around your logged sessions.
                </p>
            </header>

            {sessions && sessions.length > 0 && (
                <p className="border-l-[3px] border-plate-20 bg-platform-800 px-4 py-3 text-[12px] text-steel">
                    <span className="font-medium text-chalk-dim">{sessions.length}</span> logged
                    {sessions.length === 1 ? ' session' : ' sessions'} will set your starting weights and volume.
                </p>
            )}

            <div className="mt-2 flex flex-col gap-3 bg-platform-800 px-4 py-4">
                <div>
                    <label htmlFor="plan-goal" className={LABEL_CLASS}>Goal</label>
                    <select id="plan-goal" value={goal} onChange={e => setGoal(e.target.value as ProgramGoal)} className={INPUT_CLASS}>
                        <option value="STRENGTH">Strength</option>
                        <option value="HYPERTROPHY">Hypertrophy</option>
                        <option value="ENDURANCE">Endurance</option>
                        <option value="GENERAL">General fitness</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="plan-experience" className={LABEL_CLASS}>Experience level (optional)</label>
                    <input id="plan-experience" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} placeholder="e.g. Intermediate" className={INPUT_CLASS} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="plan-days" className={LABEL_CLASS}>Days a week</label>
                        <input id="plan-days" type="number" min={1} max={7} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className={INPUT_CLASS} />
                    </div>
                    <div>
                        <label htmlFor="plan-weeks" className={LABEL_CLASS}>Block length (weeks)</label>
                        <input id="plan-weeks" type="number" min={1} max={52} value={durationWeeks} onChange={e => setDurationWeeks(Number(e.target.value))} className={INPUT_CLASS} />
                    </div>
                </div>

                <div>
                    <label htmlFor="plan-length" className={LABEL_CLASS}>Session length (minutes)</label>
                    <input id="plan-length" type="number" min={10} max={240} value={sessionLengthMinutes} onChange={e => setSessionLengthMinutes(Number(e.target.value))} className={INPUT_CLASS} />
                </div>

                <div>
                    <label htmlFor="plan-equipment" className={LABEL_CLASS}>Equipment you have (optional, comma separated)</label>
                    <input id="plan-equipment" value={equipment} onChange={e => setEquipment(e.target.value)} placeholder="barbell, dumbbells, pull-up bar" className={INPUT_CLASS} />
                </div>

                <div>
                    <label htmlFor="plan-split" className={LABEL_CLASS}>Split you prefer (optional)</label>
                    <input id="plan-split" value={splitPreference} onChange={e => setSplitPreference(e.target.value)} placeholder="e.g. Upper/Lower — leave blank to let it decide" className={INPUT_CLASS} />
                </div>

                <div>
                    <label htmlFor="plan-focus" className={LABEL_CLASS}>Muscle groups to emphasize (optional, comma separated)</label>
                    <input id="plan-focus" value={focusMuscleGroups} onChange={e => setFocusMuscleGroups(e.target.value)} placeholder="chest, back" className={INPUT_CLASS} />
                </div>

                <div>
                    <label htmlFor="plan-exclusions" className={LABEL_CLASS}>Movements to avoid or injuries (optional)</label>
                    <textarea id="plan-exclusions" value={exclusionsOrInjuries} onChange={e => setExclusionsOrInjuries(e.target.value)} rows={2} placeholder="e.g. no overhead pressing, knee pain on lunges" className={INPUT_CLASS} />
                </div>

                <div>
                    <label htmlFor="plan-notes" className={LABEL_CLASS}>Anything else (optional)</label>
                    <textarea id="plan-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={INPUT_CLASS} />
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-2 bg-platform-800 px-4 py-3 text-[13px] text-danger">
                    The plan didn't start. Check your connection and try again.
                </p>
            )}

            <div className="px-4 pt-4">
                <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isPending}>
                    {isPending ? 'Starting…' : 'Write my program'}
                </Button>
            </div>
        </div>
    )
}
