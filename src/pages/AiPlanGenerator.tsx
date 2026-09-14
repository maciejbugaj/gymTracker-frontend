import { useState } from 'react'
import { Button } from 'flowbite-react'
import { useStartGeneration } from '../hooks/useAiPlanGeneration'
import { useSessions } from '../hooks/useSessions'
import type { GeneratePlanRequest, ProgramGoal } from '../types'

const inputClass = "w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
const labelClass = "block text-xs text-gray-400 mb-1"

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
        <div className="w-full px-4 pb-24 pt-2">
            <div className="px-2 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-1">AI Coach</p>
                <h1>Generate a training program</h1>
                <p className="text-gray-500 text-sm mt-1">Tell us your goal — Claude will design a periodized program using your training history.</p>
            </div>

            {sessions && sessions.length > 0 && (
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">From your history</h3>
                    <p className="text-xs text-gray-400">
                        {sessions.length} logged session{sessions.length === 1 ? '' : 's'} will be used to calibrate starting weights and volume.
                    </p>
                </div>
            )}

            <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 mb-4 flex flex-col gap-3">
                <div>
                    <label className={labelClass}>Goal</label>
                    <select value={goal} onChange={e => setGoal(e.target.value as ProgramGoal)} className={inputClass}>
                        <option value="STRENGTH">Strength</option>
                        <option value="HYPERTROPHY">Hypertrophy</option>
                        <option value="ENDURANCE">Endurance</option>
                        <option value="GENERAL">General fitness</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Experience level (optional)</label>
                    <input value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} placeholder="e.g. Intermediate" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Training days / week</label>
                        <input type="number" min={1} max={7} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Program length (weeks)</label>
                        <input type="number" min={1} max={52} value={durationWeeks} onChange={e => setDurationWeeks(Number(e.target.value))} className={inputClass} />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Session length (minutes)</label>
                    <input type="number" min={10} max={240} value={sessionLengthMinutes} onChange={e => setSessionLengthMinutes(Number(e.target.value))} className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Equipment (optional, comma separated)</label>
                    <input value={equipment} onChange={e => setEquipment(e.target.value)} placeholder="barbell, dumbbells, pull-up bar" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Split preference (optional)</label>
                    <input value={splitPreference} onChange={e => setSplitPreference(e.target.value)} placeholder="e.g. Upper/Lower, Push/Pull/Legs — leave blank to let the AI decide" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Muscle groups to emphasize (optional, comma separated)</label>
                    <input value={focusMuscleGroups} onChange={e => setFocusMuscleGroups(e.target.value)} placeholder="chest, back" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Exclusions / injuries (optional)</label>
                    <textarea value={exclusionsOrInjuries} onChange={e => setExclusionsOrInjuries(e.target.value)} rows={2} placeholder="e.g. avoid overhead pressing, knee pain on lunges" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Additional notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} />
                </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-3">Could not start generation. Please try again.</p>}

            <Button color="purple" size="lg" className="w-full" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Starting…' : 'Generate Program'}
            </Button>
        </div>
    )
}
