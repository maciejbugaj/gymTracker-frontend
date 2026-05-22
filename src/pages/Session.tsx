import { useStore } from '../stores/StoreSession'
import BreakTimer from '../components/BreakTimer';
import { useWorkoutTemplateById } from '../hooks/useWorkoutTemplates';
import { Badge, Button, Card } from 'flowbite-react';
import SessionDuration from '../components/SessionDuration';
import { useGetExerciseLogsByWorkoutTemplateId, useLogExerciseSet } from '../hooks/useExerciseLog';
import type { ExerciseLog } from '../types';
import { useFinishSession } from '../hooks/useSessions';
import { useNavigate } from 'react-router-dom';


export default function Session() {
    const navigate = useNavigate();
    const session = useStore((state) => state.ongoingSession)
    const { data: workoutTemplate } = session ? useWorkoutTemplateById(session?.workoutTemplateId) : { data: null }
    const { data: previousExerciseLogs } = session ? useGetExerciseLogsByWorkoutTemplateId(session!.workoutTemplateId!) : { data: [] }
    console.log('workoutTemplate', workoutTemplate)
    console.log('previousExerciseLogs', previousExerciseLogs)

    const { mutate: logExerciseSet } = useLogExerciseSet()
    const { mutate: finishSession } = useFinishSession()

    function handleLogSet(event: React.SubmitEvent<HTMLFormElement>, exerciseName: string) {
        event.preventDefault()
        const form = event.currentTarget
        const reps = Number(form.reps.value)
        const weightKg = Number(form.weightKg.value)
        const exerciseLog: ExerciseLog = {
            workoutSessionId: session!.id!,
            exerciseName: exerciseName,
            reps,
            weightKg
        }
        console.log('Logging set', exerciseLog)
        logExerciseSet(exerciseLog)
    }

    function handleFinishSession() {
        const sessionId = session?.id
        if (sessionId) {
            finishSession(sessionId)
            navigate('/')
        } else {
            console.error('No session to finish')
        }

    }

    if (!session) {
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
            <div className='p-4 border-b'>
                <h1>{session?.workoutTemplateName}</h1>
            </div>
            <SessionDuration startedAt={session?.startedAt} />
            <BreakTimer />
            <div className='grid'>
                <div className="m-2">
                    <div className="flex">
                        <h3>LOG SETS</h3>
                    </div>
                </div>
                {workoutTemplate?.exercises.map(exercise => (
                    <Card key={exercise.id}>
                        <div className='flex items-center justify-between'>
                            <h2>{exercise.exerciseName}</h2>
                            <div>{session.exerciseLogs ? session?.exerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).length : 1}/{exercise.defaultSets}</div>

                        </div>
                        <div className='flex items-center -mt-6'>
                            <h3>Last:</h3>
                            {previousExerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                                <Badge key={log.id} color="gray" className='m-1'>Set {log.setNumber}: {log.reps} x {log.weightKg}kg</Badge>
                            ))}
                        </div>
                        <div>
                            <form className='flex flex-row gap-2 align-items-center' onSubmit={(event) => handleLogSet(event, exercise.exerciseName)}>
                                <input style={{ width: '25px' }} name='reps' type='number' placeholder={exercise.defaultReps ? exercise.defaultReps.toString() : '0'} />
                                <p>x</p>
                                <input style={{ width: '25px' }} name='weightKg' type='number' placeholder={exercise.defaultWeight ? exercise.defaultWeight.toString() : '0'} />kg
                                <Button type='submit' color="alternative" size="sm">Log Set</Button>
                            </form>
                        </div>
                        <div className='flex flex-row gap-2 align-items-center'>
                            {session.exerciseLogs?.filter(log => log.exerciseName === exercise.exerciseName).map(log => (
                                <Button key={log.id} color="light" size="xs">{log.setNumber}:  {log.reps} x {log.weightKg}kg</Button>
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