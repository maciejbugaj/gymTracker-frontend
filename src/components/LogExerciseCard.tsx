import { useStore } from '../stores/StoreSession'
import { Badge, Button, Card } from 'flowbite-react';
import type { ExerciseLog } from '../types';
import { useWorkoutTemplateById } from '../hooks/useWorkoutTemplates';
import { useGetExerciseLogsByWorkoutTemplateId, useLogExerciseSet } from '../hooks/useExerciseLog';


export default function LogExerciseCard() {

    const exerciseLogs = useStore((state) => state.ongoingSession?.exerciseLogs) ?? []
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateId = useStore((state) => state.ongoingSession?.workoutTemplateId)
    const { data: previousExerciseLogs } = useGetExerciseLogsByWorkoutTemplateId(workoutTemplateId)
    const { mutate: logExerciseSet } = useLogExerciseSet()
    const { data: workoutTemplate } = useWorkoutTemplateById(workoutTemplateId)

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
            {workoutTemplate?.exercises.map(exercise => (
                <Card key={exercise.id} className='mt-2 mb-2'>
                    <div className='flex items-center justify-between'>
                        <h2 className="text-base font-semibold text-gray-100 tracking-tight normal-case">{exercise.exerciseName}</h2>
                        <span className="stat-number text-sm text-violet-400">
                            {exerciseLogs.filter(log => log.exerciseName === exercise.exerciseName).length}
                            <span className="text-gray-600">/{exercise.defaultSets}</span>
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
                            <label htmlFor={`reps-${exercise.id}`} className="sr-only">Reps</label>
                            <input id={`reps-${exercise.id}`} className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='reps' type='number' inputMode="numeric" placeholder={exercise.defaultReps ? `e.g. ${exercise.defaultReps}…` : 'e.g. 8…'} />
                            <p>x</p>
                            <label htmlFor={`weightKg-${exercise.id}`} className="sr-only">Weight (kg)</label>
                            <input id={`weightKg-${exercise.id}`} className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='weightKg' type='number' inputMode="decimal" placeholder={exercise.defaultWeight ? `e.g. ${exercise.defaultWeight}…` : 'e.g. 60…'} />kg
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