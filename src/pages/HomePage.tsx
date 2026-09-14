import { useCreateSession, useLastOngoingSession, useLastSession } from '../hooks/useSessions'
import LastSessionCard from '../components/LastSessionCard';
import NewSessionCard from '../components/NewSessionCard';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { useActiveProgram } from '../hooks/useTrainingPrograms';
import { Button } from 'flowbite-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkoutTemplate } from '../types';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';
import OngoingSessionCard from '../components/OngoingSessionCard';

export default function HomePage() {
    const { data: session, isLoading: isLoadingSession, error: errorSession } = useLastSession()
    const { data: ongoingSession } = useLastOngoingSession()
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()
    const { data: activeProgram } = useActiveProgram()
    const { mutate: createSession } = useCreateSession()
    const [workoutTemplateToStart, setWorkoutTemplateToStart] = useState<WorkoutTemplate | null>(null)


    const startSession = () => {
        if (workoutTemplateToStart) {
            createSession({
                workoutTemplateId: workoutTemplateToStart.id
            })
        }
    }

    const startProgramDay = () => {
        if (activeProgram?.nextDay) {
            createSession({ programDayId: activeProgram.nextDay.programDayId })
        }
    }

    useSyncOngoingSession();

    return (

        <div className='w-full px-4 pb-16'>
            <div className='px-4 pt-6 pb-2'>
                <h1>GYM Tracker</h1>
                <p className="text-gray-500 text-sm mt-1">Choose a session to start</p>
            </div>

            {ongoingSession && <OngoingSessionCard session={ongoingSession} />}

            {activeProgram && (
                <Link to={`/programs/${activeProgram.program.id}`} className="block rounded-xl bg-gray-800 border border-violet-500/30 p-4 mx-2 mb-4 hover:bg-gray-700 transition-colors">
                    <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-1">Active Program</p>
                    <p className="text-sm font-medium text-gray-100 mb-2">{activeProgram.program.name}</p>
                    {activeProgram.nextDay ? (
                        <>
                            <p className="text-xs text-gray-400 mb-3">
                                Next: Week {activeProgram.nextDay.weekNumber} · Day {activeProgram.nextDay.dayNumber}
                                {activeProgram.nextDay.dayName ? ` (${activeProgram.nextDay.dayName})` : ''}
                            </p>
                            <Button
                                color="purple" size="sm" className="w-full"
                                onClick={(e) => { e.preventDefault(); startProgramDay() }}
                                disabled={!!ongoingSession}
                            >
                                Start
                            </Button>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400">All days completed 🎉</p>
                    )}
                </Link>
            )}

            <div className='grid'>
                <div>
                    <div className="flex">
                        <h2>Last Session</h2>
                    </div>
                </div>
                <LastSessionCard
                    session={session}
                    isLoading={isLoadingSession}
                    error={errorSession}
                    description={workoutTemplates?.find(t => t.id === session?.workoutTemplateId)?.description}
                />
                <div className="mt-2">
                    <div className="flex">
                        <h2>Start Session</h2>
                    </div>
                </div>

                {workoutTemplates?.map(template => (
                    <NewSessionCard
                        key={template.id}
                        template={template}
                        isLoading={isLoadingTemplates}
                        error={errorTemplates}
                        isSelected={workoutTemplateToStart?.id === template.id}
                        setWorkoutTemplateToStart={setWorkoutTemplateToStart}
                    />
                ))}
            </div>
            <div className='flex mt-4 mb-20'>
                {!workoutTemplateToStart && !ongoingSession && <p className='w-full text-sm sm:text-xl text-gray-500'>Select a session to start</p>}
                {ongoingSession && <p className='w-full text-sm sm:text-lg text-gray-500'>Finish or discard the ongoing session before starting a new one.</p>}
                {workoutTemplateToStart && !ongoingSession && <Button className='w-full text-xl' color="alternative" size="lg" onClick={startSession}>Start Session</Button>}
            </div>
        </div>
    )
}