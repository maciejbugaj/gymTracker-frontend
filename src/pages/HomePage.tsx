import NavBarMobile from '../components/NavBarMobile'
import { useLastSession } from '../hooks/useSessions'
import LastSessionCard from '../components/LastSessionCard';
import NewSessionCard from '../components/NewSessionCard';

export default function HomePage() {
    const { data: session, isLoading: isLoadingSession, error: errorSession } = useLastSession()
    console.log('Session:', session)
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
                <div className="m-2">
                    <div className="flex">
                        <h3>START SESSION</h3>
                    </div>
                </div>
                <NewSessionCard session={session} isLoading={isLoadingSession} error={errorSession} />
            </div>


            <NavBarMobile />
        </div>
    )
}