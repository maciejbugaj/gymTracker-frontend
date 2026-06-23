import { useState, useEffect, useRef } from 'react'
import prettyMilliseconds from 'pretty-ms';
import { Button } from 'flowbite-react';

const BREAK_DURATION = 90 * 1000 // 90 seconds in milliseconds
export default function BreakTimer() {
    const [isOnBreak, setIsOnBreak] = useState<boolean>(false)
    const [breakTimer, setBreakTimer] = useState<number>(BREAK_DURATION)

    const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    useEffect(() => {
        if (!isOnBreak) return

        breakIntervalRef.current = setInterval(() => {
            setBreakTimer(prev => {
                if (prev <= 1000) {
                    clearInterval(breakIntervalRef.current!)
                    setIsOnBreak(false)
                    return 0
                }
                return prev - 1000
            })
        }, 1000)

        return () => clearInterval(breakIntervalRef.current!)
    }, [isOnBreak])

    function onBreakStart() {
        setIsOnBreak(true)
        if (breakTimer === 0) {
            setBreakTimer(BREAK_DURATION)
        }
    }

    function onBreakReset() {
        setIsOnBreak(false)
        clearInterval(breakIntervalRef.current!)
        setBreakTimer(BREAK_DURATION)
    }
    return (
        <div className='flex items-center gap-4 px-4 py-3 border-t border-b border-gray-700/50'>
            <div className='flex flex-col'>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Break</span>
                <span className={`timer text-2xl ${isOnBreak && breakTimer <= 10000 ? 'text-red-400' : isOnBreak ? 'text-violet-400' : ''}`}>
                    {prettyMilliseconds(breakTimer, { secondsDecimalDigits: 0 })}
                </span>
            </div>
            <div className='flex gap-2 ml-auto'>
                <Button color="alternative" size="sm" onClick={onBreakStart} disabled={isOnBreak && breakTimer > 0}>Start</Button>
                <Button color="alternative" size="sm" onClick={onBreakReset}>Reset</Button>
            </div>
        </div>
    )
}