import prettyMilliseconds from "pretty-ms"
import { useEffect, useState } from "react"

interface SessionDurationProps {
    startedAt: string | undefined
}

/** Elapsed time, rendered inline so it can sit in a session header next to the block and week. */
export default function SessionDuration({ startedAt }: SessionDurationProps) {
    // Only the clock lives in state — the elapsed time is derived, so the first paint is
    // already correct instead of showing 0s until the first tick.
    const [now, setNow] = useState<number>(() => Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const elapsedTime = startedAt ? Math.max(0, now - new Date(startedAt).getTime()) : 0

    return (
        <span className="text-chalk-dim">
            {prettyMilliseconds(elapsedTime, { secondsDecimalDigits: 0 })}
        </span>
    )
}
