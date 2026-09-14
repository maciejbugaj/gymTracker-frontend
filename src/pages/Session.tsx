import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BreakTimer from '../components/BreakTimer';
import SessionDuration from '../components/SessionDuration';
import { useDiscardSession, useFinishSession } from '../hooks/useSessions';
import LogExerciseCard from '../components/LogExerciseCard';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';
import { useStore } from '../stores/StoreSession';
import Button from '../components/ui/Button';
import { buttonClass } from '../components/ui/buttonClass';

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
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="font-condensed text-[24px] font-bold leading-none">No session running</h1>
                <p className="max-w-xs text-[13px] text-steel">
                    Pick a template or a program day on the home screen to start logging sets.
                </p>
                <Link to="/" className={buttonClass('solid', 'md')}>Go to home</Link>
            </div>
        )
    }

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <p className="flex flex-wrap items-baseline gap-x-2 font-condensed text-[12px] font-semibold text-steel">
                    {programName && (
                        <span>
                            {programName}
                            {weekNumber != null ? ` · week ${weekNumber}` : ''}
                            {isDeload ? ' · deload' : ''}
                        </span>
                    )}
                    <SessionDuration startedAt={startedAt} />
                </p>
                <h1 className="mt-1 font-condensed text-[26px] font-bold leading-none">{sessionTitle}</h1>
            </header>

            <BreakTimer />

            <LogExerciseCard />

            <div className="px-4 pt-5">
                {confirmFinish && (
                    <div className="flex gap-2">
                        <Button variant="solid" size="lg" className="flex-1" onClick={handleFinishSession}>Confirm finish</Button>
                        <Button variant="quiet" size="lg" className="flex-1" onClick={() => setConfirmFinish(false)}>Keep going</Button>
                    </div>
                )}
                {confirmDiscard && (
                    <>
                        <p className="mb-2 text-[12px] text-steel">
                            Discarding deletes this session and every set logged in it. This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="danger" size="lg" className="flex-1" disabled={isDiscarding} onClick={handleDiscardSession}>
                                {isDiscarding ? 'Discarding…' : 'Confirm discard'}
                            </Button>
                            <Button variant="quiet" size="lg" className="flex-1" onClick={() => setConfirmDiscard(false)}>Keep</Button>
                        </div>
                    </>
                )}
                {!confirmFinish && !confirmDiscard && (
                    <div className="flex gap-2">
                        <Button variant="solid" size="lg" className="flex-1" onClick={() => setConfirmFinish(true)}>Finish session</Button>
                        <Button variant="quiet" size="lg" className="flex-1" onClick={() => setConfirmDiscard(true)}>Discard</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
