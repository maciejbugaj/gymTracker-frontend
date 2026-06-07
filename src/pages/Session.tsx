import { useStore } from '../stores/StoreSession'
import BreakTimer from '../components/BreakTimer';
import { Button } from 'flowbite-react';
import SessionDuration from '../components/SessionDuration';
import { useFinishSession, useLastOngoingSession } from '../hooks/useSessions';
import { useEffect } from 'react';
import LogExerciseCard from '../components/LogExerciseCard';


export default function Session() {
    const { data: ongoingSession, error: errorOngoingSession } = useLastOngoingSession()
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateName = useStore((state) => state.ongoingSession?.workoutTemplateName)
    const startedAt = useStore((state) => state.ongoingSession?.startedAt)
    const { mutate: finishSession } = useFinishSession()


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
                <LogExerciseCard />
                <div className='flex mt-4 mb-20'>
                    <Button className='w-full' color='alternative' size='lg' onClick={handleFinishSession}>Finish Session</Button>
                </div>
            </div>
        </div>
    )
}