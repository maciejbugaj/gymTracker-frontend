import { useState } from 'react'
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import type { WorkoutSession } from '../types'
import { useDiscardSession } from '../hooks/useSessions'
import { formatSessionTime } from '../utils/date'

interface OngoingSessionCardProps {
    session: WorkoutSession
}

export default function OngoingSessionCard({ session }: OngoingSessionCardProps) {
    const [confirmDiscard, setConfirmDiscard] = useState(false)
    const { mutate: discardSession, isPending } = useDiscardSession()

    const loggedSets = session.exerciseLogs?.length ?? 0

    return (
        <div className="rounded-xl bg-gray-800 border border-violet-500/30 p-4 mx-2 mb-4 text-left">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-1">Session in progress</p>
            <p className="text-sm font-medium text-gray-100">{session.dayName ?? session.workoutTemplateName}</p>
            <p className="text-xs text-gray-400 mt-1">
                Started {formatSessionTime(session.startedAt)}
                {loggedSets > 0 ? ` · ${loggedSets} ${loggedSets === 1 ? 'set' : 'sets'} logged` : ' · nothing logged yet'}
            </p>

            {!confirmDiscard ? (
                <div className="flex gap-2 mt-3">
                    <Button as={Link} to="/session" color="purple" size="sm" className="w-full">Resume</Button>
                    <Button color="alternative" size="sm" className="w-full" onClick={() => setConfirmDiscard(true)}>
                        Discard
                    </Button>
                </div>
            ) : (
                <>
                    <p className="text-xs text-gray-400 mt-3">
                        Discarding deletes this session and every set logged in it. This cannot be undone.
                    </p>
                    <div className="flex gap-2 mt-2">
                        <Button
                            color="failure" size="sm" className="w-full"
                            disabled={isPending}
                            onClick={() => discardSession(session.id)}
                        >
                            {isPending ? 'Discarding…' : 'Confirm discard'}
                        </Button>
                        <Button color="alternative" size="sm" className="w-full" onClick={() => setConfirmDiscard(false)}>
                            Keep
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
