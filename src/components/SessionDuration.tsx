import prettyMilliseconds from "pretty-ms"
import { useEffect, useState } from "react"

interface SessionDurationProps {
    startedAt: string | undefined
}

export default function SessionDuration({ startedAt }: SessionDurationProps) {

    const [elapsedTime, setElapsedTime] = useState<number>(0)

    useEffect(() => {
        if (!startedAt) return

        const start = new Date(startedAt).getTime()

        const interval = setInterval(() => {
            setElapsedTime(new Date().getTime() - start)
        }, 1000)

        return () => clearInterval(interval)
    }, [startedAt])

    return (
        <div className="px-4 pb-4 flex items-baseline gap-3">
            <span className="timer">{prettyMilliseconds(elapsedTime, { secondsDecimalDigits: 0 })}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">elapsed</span>
        </div>
    )
}