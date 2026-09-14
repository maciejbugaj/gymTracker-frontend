import { useState, useEffect } from 'react'
import prettyMilliseconds from 'pretty-ms';
import Button from './ui/Button';
import { useStore } from '../stores/StoreSession';

export default function BreakTimer() {
    // The break lives in the store because ticking a set starts it, with the length taken from
    // that exercise's prescribed rest — see useLogExerciseSet.
    const breakStartedAt = useStore(state => state.breakStartedAt)
    const breakDurationMs = useStore(state => state.breakDurationMs)
    const startBreak = useStore(state => state.startBreak)
    const stopBreak = useStore(state => state.stopBreak)

    // Only the clock is state; what's left is derived, so a restart needs no extra bookkeeping.
    const [now, setNow] = useState<number>(() => Date.now())

    useEffect(() => {
        if (breakStartedAt == null) return

        const interval = setInterval(() => {
            const tick = Date.now()
            setNow(tick)
            if (tick - breakStartedAt >= breakDurationMs) clearInterval(interval)
        }, 1000)

        return () => clearInterval(interval)
    }, [breakStartedAt, breakDurationMs])

    // Clamped at both ends: `now` can lag a restart by up to a tick, which would otherwise
    // read as more than a full break remaining.
    const remaining = breakStartedAt == null
        ? breakDurationMs
        : Math.min(breakDurationMs, Math.max(0, breakDurationMs - (now - breakStartedAt)))

    const isOnBreak = remaining > 0 && breakStartedAt != null
    const isRunningOut = isOnBreak && remaining <= 10000

    return (
        <div className="flex items-center gap-4 border-t-2 border-accent bg-platform-800 px-4 py-3">
            <div>
                <span className="block font-condensed text-[11px] font-semibold tracking-wide text-steel">Break</span>
                <span
                    role="timer"
                    aria-live="off"
                    className={`block font-condensed text-[30px] font-bold leading-none ${isRunningOut ? 'text-danger' : 'text-chalk'}`}
                >
                    {prettyMilliseconds(remaining, { secondsDecimalDigits: 0 })}
                </span>
            </div>
            <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => startBreak()} disabled={isOnBreak}>Start</Button>
                <Button variant="outline" size="sm" onClick={stopBreak}>Reset</Button>
            </div>
        </div>
    )
}
