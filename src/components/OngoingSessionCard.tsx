import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { WorkoutSession } from '../types'
import { useDiscardSession } from '../hooks/useSessions'
import { formatSessionTime } from '../utils/date'
import Button from './ui/Button'
import { buttonClass } from './ui/buttonClass'

interface OngoingSessionCardProps {
    session: WorkoutSession
}

export default function OngoingSessionCard({ session }: OngoingSessionCardProps) {
    const [confirmDiscard, setConfirmDiscard] = useState(false)
    const { mutate: discardSession, isPending } = useDiscardSession()

    const loggedSets = session.exerciseLogs?.length ?? 0

    return (
        <div className="border-l-[3px] border-accent bg-platform-800 px-4 py-3">
            <p className="font-condensed text-[16px] font-semibold leading-tight">
                {session.dayName ?? session.workoutTemplateName} — in progress
            </p>
            <p className="mt-1 text-[11.5px] text-steel">
                Started <span className="font-medium text-chalk-dim">{formatSessionTime(session.startedAt)}</span>
                {loggedSets > 0
                    ? <> · <span className="font-medium text-chalk-dim">{loggedSets}</span> {loggedSets === 1 ? 'set' : 'sets'} logged</>
                    : ' · nothing logged yet'}
            </p>

            {!confirmDiscard ? (
                <div className="mt-3 flex gap-2">
                    <Link to="/session" className={buttonClass('solid', 'sm', 'flex-1')}>Resume</Link>
                    <Button variant="quiet" size="sm" className="flex-1" onClick={() => setConfirmDiscard(true)}>
                        Discard
                    </Button>
                </div>
            ) : (
                <>
                    <p className="mt-3 text-[11.5px] text-steel">
                        Discarding deletes this session and every set logged in it. This cannot be undone.
                    </p>
                    <div className="mt-2 flex gap-2">
                        <Button
                            variant="danger" size="sm" className="flex-1"
                            disabled={isPending}
                            onClick={() => discardSession(session.id)}
                        >
                            {isPending ? 'Discarding…' : 'Confirm discard'}
                        </Button>
                        <Button variant="quiet" size="sm" className="flex-1" onClick={() => setConfirmDiscard(false)}>
                            Keep
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
