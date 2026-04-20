import NavBarMobile from '../components/NavBarMobile'
import { useSessions } from '../hooks/useSessions'
import { Card } from "flowbite-react";

export default function HomePage() {
    const { data: sessions, isLoading, error } = useSessions()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading sessions</div>

    console.log('Sessions:', sessions)

    return (

        <div className='w-full px-4'>
            <div className='p-4 border-b'>
                <h1>Gym Tracker</h1>
                <h3>Choose a session to start</h3>
            </div>
            <div>

            </div>
            <div className='grid'>
                <div className="m-2">
                    <div className="flex">
                    <h3>Recent</h3>
                    </div>
                </div>
                <Card href="#">
                    <div className='flex items-center'>
                    <h3>
                        Last session
                    </h3>
                    
                    </div>
                    <div className='flex items-center'>
                        <h2>Session A</h2>
                    </div>
                    <div className='flex items-center -mt-6'>
                        <h3>Monday 22</h3>
                    </div>
                </Card>
            </div>


            <NavBarMobile />
        </div>
    )
}