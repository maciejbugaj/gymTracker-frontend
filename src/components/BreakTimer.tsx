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
        <div className='grid grid-cols-6 gap-4 mt-4'>
            <div className='col-start-1 col-end-3 font-bold'>
                Break Timer
            </div>

            <div className='col-start-1 col-end-3 '>
                <p className='text-2xl'>{prettyMilliseconds(breakTimer)}</p>
            </div>
            <div className='col-end-4 col-start-5' >
                <Button color="alternative" size="sm" onClick={onBreakStart}>Start Break </Button>
            </div>
            <div className='col-end-5 col-start-6 ml-6' >
                <Button color="alternative" size="sm" onClick={onBreakReset}>Reset</Button>
            </div>
        </div>
    )
}