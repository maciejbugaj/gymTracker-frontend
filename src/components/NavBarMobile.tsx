import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaClock, FaCalendarAlt } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

export default function NavBarMobile() {
    const navigate = useNavigate();
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-default">
            <div className="grid h-full grid-cols-4 mx-auto font-medium">
                <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" onClick={() => navigate('/')}>
                    <FaHome size={20} />
                    <span className="text-sm">Home</span>
                </Button>
                <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" onClick={() => navigate('/session')}>
                    <FaClock size={20} />
                    <span className="text-sm">Session</span>
                </Button>
                <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" disabled>
                    <FaCalendarAlt size={20} />
                    <span className="text-sm">History</span>
                </Button>
                <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" onClick={() => navigate('/templates')}>
                    <IoIosCreate size={20} />
                    <span className="text-sm">Templates</span>
                </Button>
            </div>
        </div>
    )
}