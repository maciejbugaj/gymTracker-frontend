import { useCreateSession, useLastOngoingSession, useLastSession } from '../hooks/useSessions'
import LastSessionCard from '../components/LastSessionCard';
import NewSessionCard from '../components/NewSessionCard';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { Button } from 'flowbite-react';
import { useState } from 'react';
import type { WorkoutTemplate } from '../types';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';

export default function HomePage() {
    const { data: session, isLoading: isLoadingSession, error: errorSession } = useLastSession()
    const { data: ongoingSession } = useLastOngoingSession()
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()
    const { mutate: createSession } = useCreateSession()
    const [workoutTemplateToStart, setWorkoutTemplateToStart] = useState<WorkoutTemplate | null>(null)


    const startSession = () => {
        if (workoutTemplateToStart) {
            createSession({
                workoutTemplateId: workoutTemplateToStart.id
            })
        }
    }
    
    useSyncOngoingSession();

    return (

        <div className='w-full px-4 pb-16'>
            <div className='p-4'>
                <h1>GYM Tracker</h1>
                <h3>Choose a session to start</h3>
            </div>
            <div className='grid'>
                <div>
                    <div className="flex">
                        <h3>LAST SESSION</h3>
                    </div>
                </div>
                <LastSessionCard session={session} isLoading={isLoadingSession} error={errorSession} />
                <div className="mt-2">
                    <div className="flex">
                        <h3>START SESSION</h3>
                    </div>
                </div>

                {workoutTemplates?.map(template => (
                    <NewSessionCard template={template} isLoading={isLoadingTemplates} error={errorTemplates} setWorkoutTemplateToStart={setWorkoutTemplateToStart} key={template.id} />
                ))}
            </div>
            <div className='flex mt-4 mb-20'>
                {!workoutTemplateToStart && !ongoingSession && <p className='w-full text-sm sm:text-xl text-gray-500'>Select a session to start</p>}
                {ongoingSession && <p className='w-full text-sm sm:text-lg text-gray-500'>Please finish the ongoing session before starting a new one.</p>}
                {workoutTemplateToStart && !ongoingSession && <Button className='w-full text-xl' color="alternative" size="lg" onClick={startSession}>Start Session</Button>}
            </div>
        </div>
    )
}