
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BreakTimer from '../components/BreakTimer';
import { Button } from 'flowbite-react';
import SessionDuration from '../components/SessionDuration';
import { useDiscardSession, useFinishSession } from '../hooks/useSessions';
import LogExerciseCard from '../components/LogExerciseCard';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';
import { useStore } from '../stores/StoreSession';


export default function Session() {
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateName = useStore((state) => state.ongoingSession?.workoutTemplateName)
    const programName = useStore((state) => state.ongoingSession?.programName)
    const dayName = useStore((state) => state.ongoingSession?.dayName)
    const weekNumber = useStore((state) => state.ongoingSession?.weekNumber)
    const isDeload = useStore((state) => state.ongoingSession?.isDeload)
    const startedAt = useStore((state) => state.ongoingSession?.startedAt)
    const sessionTitle = dayName ?? workoutTemplateName
    const { mutate: finishSession } = useFinishSession()
    const { mutate: discardSession, isPending: isDiscarding } = useDiscardSession()
    const [confirmFinish, setConfirmFinish] = useState(false)
    const [confirmDiscard, setConfirmDiscard] = useState(false)
    const navigate = useNavigate()


    function handleFinishSession() {
        if (!sessionId) {
            console.error('No session to finish')
            return
        }
        finishSession(sessionId)
    }

    function handleDiscardSession() {
        if (!sessionId) {
            console.error('No session to discard')
            return
        }
        discardSession(sessionId, { onSuccess: () => navigate('/') })
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
                <h1>{sessionTitle}</h1>
                {programName && (
                    <p className="text-gray-500 text-sm mt-1">
                        {programName} · Week {weekNumber}{isDeload ? ' · Deload' : ''}
                    </p>
                )}
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
                <div className='mt-4 mb-20'>
                    {confirmFinish && (
                        <div className='flex gap-2'>
                            <Button className='w-full' color='failure' size='lg' onClick={handleFinishSession}>Confirm Finish</Button>
                            <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmFinish(false)}>Cancel</Button>
                        </div>
                    )}
                    {confirmDiscard && (
                        <>
                            <p className='text-xs text-gray-400 mb-2 text-left'>
                                Discarding deletes this session and every set logged in it. This cannot be undone.
                            </p>
                            <div className='flex gap-2'>
                                <Button className='w-full' color='failure' size='lg' disabled={isDiscarding} onClick={handleDiscardSession}>
                                    {isDiscarding ? 'Discarding…' : 'Confirm Discard'}
                                </Button>
                                <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmDiscard(false)}>Keep</Button>
                            </div>
                        </>
                    )}
                    {!confirmFinish && !confirmDiscard && (
                        <div className='flex gap-2'>
                            <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmFinish(true)}>Finish Session</Button>
                            <Button className='w-full' color='alternative' size='lg' onClick={() => setConfirmDiscard(true)}>Discard</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}