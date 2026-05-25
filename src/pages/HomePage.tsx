import { useCreateSession, useLastOngoingSession, useLastSession } from '../hooks/useSessions'
import LastSessionCard from '../components/LastSessionCard';
import NewSessionCard from '../components/NewSessionCard';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import type { WorkoutTemplate } from '../types';
import { useStore } from '../stores/StoreSession';

export default function HomePage() {
    const { data: session, isLoading: isLoadingSession, error: errorSession } = useLastSession()
    const { data: ongoingSession, error: errorOngoingSession } = useLastOngoingSession()
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

    useEffect(() => {
        if (ongoingSession) {
            useStore.getState().setOngoingSession(ongoingSession)
        } else {
            useStore.getState().setOngoingSession(null)
        }
    }, [errorOngoingSession, ongoingSession])

    console.log('session', session)
    console.log('workoutTemplates', workoutTemplates)

    return (

        <div className='w-full px-4'>
            <div className='p-4 border-b'>
                <h1>Gym Tracker</h1>
                <h3>Choose a session to start</h3>
            </div>
            <div className='grid'>
                <div className="m-2">
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
                {!workoutTemplateToStart && !ongoingSession && <p className='w-full text-lg text-gray-500'>Select a session to start</p>}
                {(workoutTemplateToStart || !workoutTemplateToStart) && ongoingSession && <p className='w-full text-lg text-gray-500'>Please finish the ongoing session before starting a new one.</p>}
                {workoutTemplateToStart && !ongoingSession && <Button className='w-full' color="alternative" size="lg" onClick={startSession}>Start Session</Button>}
            </div>
        </div>
    )
}