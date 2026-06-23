
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BreakTimer from '../components/BreakTimer';
import { Button } from 'flowbite-react';
import SessionDuration from '../components/SessionDuration';
import { useFinishSession } from '../hooks/useSessions';
import LogExerciseCard from '../components/LogExerciseCard';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';
import { useStore } from '../stores/StoreSession';


export default function Session() {
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateName = useStore((state) => state.ongoingSession?.workoutTemplateName)
    const startedAt = useStore((state) => state.ongoingSession?.startedAt)
    const { mutate: finishSession } = useFinishSession()
    const [confirmFinish, setConfirmFinish] = useState(false)


    function handleFinishSession() {
        if (!sessionId) {
            console.error('No session to finish')
            return
        }
        finishSession(sessionId)
    }

    useSyncOngoingSession();

    if (!sessionId) {
        return (
            <div className='w-full px-4 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center'>
                <h1 className="text-gray-300">No active session</h1>
                <p className="text-gray-500 text-sm max-w-xs">Select a template on the home page to start tracking your workout.</p>
                <Link to="/" className="mt-2 px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
                    Go to Home
                </Link>
            </div>
        )
    }

    return (
        <div className='w-full px-4'>
            <div className='px-4 pt-6 pb-2'>
                <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-1">Active Session</p>
                <h1>{workoutTemplateName}</h1>
            </div>
            <SessionDuration startedAt={startedAt} />
            <BreakTimer />
            <div className='grid'>
                <div className="m-2">
                    <div className="flex">
                        <h2>Log Sets</h2>
                    </div>
                </div>
                <LogExerciseCard />
                <div className='flex gap-2 mt-4 mb-20'>
                    {!confirmFinish ? (
                        <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmFinish(true)}>Finish Session</Button>
                    ) : (
                        <>
                            <Button className='w-full' color='failure' size='lg' onClick={handleFinishSession}>Confirm Finish</Button>
                            <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmFinish(false)}>Cancel</Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}