import { Link, useLocation } from "react-router-dom";
import { FaHome, FaClock, FaCalendarAlt } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

const baseClass = "inline-flex flex-col h-full w-full items-center justify-center px-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 font-medium text-xs gap-1";
const activeClass = "bg-gray-900 text-violet-400 dark:bg-gray-900 border-t-2 border-violet-500";
const inactiveClass = "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 border-t-2 border-transparent";

export default function NavBarMobile() {
    const { pathname } = useLocation();
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="grid h-full grid-cols-4 mx-auto">
                <Link to="/" className={`${baseClass} ${pathname === '/' ? activeClass : inactiveClass}`}>
                    <FaHome size={18} aria-hidden="true" />
                    <span>Home</span>
                </Link>
                <Link to="/session" className={`${baseClass} ${pathname === '/session' ? activeClass : inactiveClass}`}>
                    <FaClock size={18} aria-hidden="true" />
                    <span>Session</span>
                </Link>
                <Link to="/history" className={`${baseClass} ${pathname === '/history' ? activeClass : inactiveClass}`}>
                    <FaCalendarAlt size={18} aria-hidden="true" />
                    <span>History</span>
                </Link>
                <Link to="/templates" className={`${baseClass} ${pathname === '/templates' ? activeClass : inactiveClass}`}>
                    <IoIosCreate size={18} aria-hidden="true" />
                    <span>Templates</span>
                </Link>
            </div>
        </div>
    )
}