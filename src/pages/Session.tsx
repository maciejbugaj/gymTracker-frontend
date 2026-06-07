import { useStore } from '../stores/StoreSession'
import BreakTimer from '../components/BreakTimer';
import { useWorkoutTemplateById } from '../hooks/useWorkoutTemplates';
import { Badge, Button, Card } from 'flowbite-react';
import SessionDuration from '../components/SessionDuration';
import { useGetExerciseLogsByWorkoutTemplateId, useLogExerciseSet } from '../hooks/useExerciseLog';
import type { ExerciseLog } from '../types';
import { useFinishSession, useLastOngoingSession } from '../hooks/useSessions';
import { useEffect } from 'react';


export default function Session() {
    const { data: ongoingSession, error: errorOngoingSession } = useLastOngoingSession()
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateId = useStore((state) => state.ongoingSession?.workoutTemplateId)
    const workoutTemplateName = useStore((state) => state.ongoingSession?.workoutTemplateName)
    const startedAt = useStore((state) => state.ongoingSession?.startedAt)
    const exerciseLogs = useStore((state) => state.ongoingSession?.exerciseLogs) ?? []

    const { data: workoutTemplate } = useWorkoutTemplateById(workoutTemplateId)
    const { data: previousExerciseLogs } = useGetExerciseLogsByWorkoutTemplateId(workoutTemplateId)

    console.log('workoutTemplate', workoutTemplate)
    console.log('previousExerciseLogs', previousExerciseLogs)

    const { mutate: logExerciseSet } = useLogExerciseSet()
    const { mutate: finishSession } = useFinishSession()

    function handleLogSet(event: React.SubmitEvent<HTMLFormElement>, exerciseName: string) {
        event.preventDefault()
        const form = event.currentTarget

        const exerciseLog: ExerciseLog = {
            workoutSessionId: sessionId,
            exerciseName: exerciseName,
            reps: Number(form.reps.value),
            weightKg: Number(form.weightKg.value)
        }

        console.log('Logging set', exerciseLog)
        logExerciseSet(exerciseLog)
    }

    function handleFinishSession() {
        if (!sessionId) {
            console.error('No session to finish')
            return
        }
        finishSession(sessionId)
    }

    useEffect(() => {
        if (ongoingSession) {
            useStore.getState().setOngoingSession(ongoingSession)
        } else {
            useStore.getState().setOngoingSession(null)
        }
    }, [errorOngoingSession, ongoingSession])

    if (!sessionId) {
        return (
            <div className='w-full px-4'>
                <div className='p-4 border-b'>
                    <h1>No ongoing session</h1>
                </div>
            </div>
        )
    }


    return (
        <div className='w-full px-4'>
            <div className='p-4'>
                <h1>{workoutTemplateName}</h1>
            </div>
            <SessionDuration startedAt={startedAt} />
            <BreakTimer />
            <div className='grid'>
                <div className="m-2">
                    <div className="flex">
                        <h3>LOG SETS</h3>
                    </div>
                </div>
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
                <div className='flex mt-4 mb-20'>
                    <Button className='w-full' color='alternative' size='lg' onClick={handleFinishSession}>Finish Session</Button>
                </div>
            </div>
        </div>
    )
}