import { useStore } from '../stores/StoreSession'
import { Badge, Button, Card } from 'flowbite-react';
import type { ExerciseLog } from '../types';
import { useWorkoutTemplateById } from '../hooks/useWorkoutTemplates';
import { useGetExerciseLogsByProgramDayId, useGetExerciseLogsByWorkoutTemplateId, useLogExerciseSet } from '../hooks/useExerciseLog';

type ExerciseTarget = {
    key: number
    exerciseName: string
    setsTarget?: number
    repsPlaceholder: string
}

export default function LogExerciseCard() {

    const exerciseLogs = useStore((state) => state.ongoingSession?.exerciseLogs) ?? []
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateId = useStore((state) => state.ongoingSession?.workoutTemplateId)
    const programDayId = useStore((state) => state.ongoingSession?.programDayId)
    const prescribedExercises = useStore((state) => state.ongoingSession?.prescribedExercises)
    const { data: previousFromTemplate } = useGetExerciseLogsByWorkoutTemplateId(workoutTemplateId)
    const { data: previousFromProgram } = useGetExerciseLogsByProgramDayId(programDayId)
    const { mutate: logExerciseSet } = useLogExerciseSet()
    const { data: workoutTemplate } = useWorkoutTemplateById(workoutTemplateId)

    const previousExerciseLogs = programDayId ? previousFromProgram : previousFromTemplate

    // Same list either way — just sourced from the program day's prescription (sets ×
    // rep range) instead of the template's defaults (single set/rep numbers).
    const exercisesToLog: ExerciseTarget[] = programDayId
        ? (prescribedExercises ?? []).map(exercise => ({
            key: exercise.id,
            exerciseName: exercise.exerciseName,
            setsTarget: exercise.targetSets,
            repsPlaceholder: `${exercise.targetRepsMin}-${exercise.targetRepsMax}`,
        }))
        : (workoutTemplate?.exercises ?? []).map(exercise => ({
            key: exercise.id,
            exerciseName: exercise.exerciseName,
            setsTarget: exercise.defaultSets,
            repsPlaceholder: exercise.defaultReps ? String(exercise.defaultReps) : '8',
        }))

    function handleLogSet(event: React.SubmitEvent<HTMLFormElement>, exerciseName: string) {
        event.preventDefault()
        const form = event.currentTarget

        if (!sessionId) {
            console.error('No session to log exercise for')
            return
        }

        const exerciseLog: ExerciseLog = {
            workoutSessionId: sessionId,
            exerciseName: exerciseName,
            reps: Number(form.reps.value),
            weightKg: Number(form.weightKg.value)
        }
        logExerciseSet(exerciseLog)
    }


    return (
        <>
            {exercisesToLog.map(exercise => (
                <Card key={exercise.key} className='mt-2 mb-2'>
                    <div className='flex items-center justify-between'>
                        <h2 className="text-base font-semibold text-gray-100 tracking-tight normal-case">{exercise.exerciseName}</h2>
                        <span className="stat-number text-sm text-violet-400">
                            {exerciseLogs.filter(log => log.exerciseName === exercise.exerciseName).length}
                            <span className="text-gray-600">/{exercise.setsTarget}</span>
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <h3>Previous:</h3>
                        <div className='grid grid-cols-4'>
                            {previousExerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                                <Badge key={log.id} color="gray" className='pl-1 pr-1 pt-0 pb-0 m-1 border border-gray-200 rounded-lg text-xs leading-4'>Set {log.setNumber}: {log.reps} x {log.weightKg}kg</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <form className='flex flex-row gap-2 items-center' onSubmit={(event) => handleLogSet(event, exercise.exerciseName)}>
                            <label htmlFor={`reps-${exercise.key}`} className="sr-only">Reps</label>
                            <input id={`reps-${exercise.key}`} className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='reps' type='number' inputMode="numeric" placeholder={`e.g. ${exercise.repsPlaceholder}…`} />
                            <p>x</p>
                            <label htmlFor={`weightKg-${exercise.key}`} className="sr-only">Weight (kg)</label>
                            <input id={`weightKg-${exercise.key}`} className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='weightKg' type='number' inputMode="decimal" placeholder='e.g. 60…' />kg
                            <Button type='submit' color="alternative" size="sm">Log Set</Button>
                        </form>
                    </div>
                    <div className='grid grid-cols-4 gap-1 items-center'>
                        {exerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                            <Button className='text-xs leading-4' key={log.id} color="light" size="xs">Set {log.setNumber}: {log.reps} x {log.weightKg}kg</Button>
                        ))}
                    </div>
                </Card>
            ))}
        </>
    )

}
