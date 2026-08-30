import { Link, useLocation } from "react-router-dom";
import { FaHome, FaClock, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { useAuth } from "react-oidc-context";

const baseClass = "inline-flex flex-col h-full w-full items-center justify-center px-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 font-medium text-xs gap-1";
const activeClass = "bg-gray-900 text-violet-400 dark:bg-gray-900 border-t-2 border-violet-500";
const inactiveClass = "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 border-t-2 border-transparent";

export default function NavBarMobile() {
    const { pathname } = useLocation();
    const auth = useAuth();
    return (
        <>
            <div className="fixed top-2 right-2 z-50 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-gray-500 shadow dark:bg-gray-800/90 dark:text-gray-400">
                <span className="max-w-40 truncate">{auth.user?.profile.email}</span>
                <button
                    onClick={() => auth.signoutRedirect()}
                    aria-label="Wyloguj"
                    className="hover:text-gray-900 dark:hover:text-white"
                >
                    <FaSignOutAlt size={14} aria-hidden="true" />
                </button>
            </div>

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
        </>
    )
}