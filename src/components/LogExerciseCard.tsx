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
                        <h2>{exercise.exerciseName}</h2>
                        <div>{exerciseLogs ? exerciseLogs.filter(log => log.exerciseName === exercise.exerciseName).length : 1}/{exercise.defaultSets}</div>

                    </div>
                    <div className='flex items-center -mt-6'>
                        <h3>Previous:</h3>
                        <div className='grid grid-cols-4'>
                            {previousExerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                                <Badge key={log.id} color="gray" className='pl-1 pr-1 pt-0 pb-0 m-1 border border-gray-200 rounded-lg text-[0.6em] leading-3'>Set {log.setNumber}: {log.reps} x {log.weightKg}kg</Badge>
                            ))}
                        </div>

                    </div>
                    <div>
                        <form className='flex flex-row gap-2 align-items-center' onSubmit={(event) => handleLogSet(event, exercise.exerciseName)}>
                            <input className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='reps' type='number' placeholder={exercise.defaultReps ? exercise.defaultReps.toString() : '0'} />
                            <p>x</p>
                            <input className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm" name='weightKg' type='number' placeholder={exercise.defaultWeight ? exercise.defaultWeight.toString() : '0'} />kg
                            <Button type='submit' color="alternative" size="sm">Log Set</Button>
                        </form>
                    </div>
                    <div className='grid grid-cols-4 gap-1 align-items-center'>
                        {exerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                            <Button className='text-[0.6em] leading-3' key={log.id} color="light" size="xs">Set {log.setNumber}:  {log.reps} x {log.weightKg}kg</Button>
                        ))}
                    </div>
                </Card>
            ))}
        </>
    )

}