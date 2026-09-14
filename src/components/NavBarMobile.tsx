import { Link, useLocation } from "react-router-dom";
import { FiCalendar, FiClock, FiHome, FiLayers, FiLogOut, FiZap } from "react-icons/fi";
import { useAuth } from "react-oidc-context";

const TABS = [
    { to: '/', label: 'Home', Icon: FiHome, isActive: (path: string) => path === '/' },
    { to: '/session', label: 'Session', Icon: FiClock, isActive: (path: string) => path === '/session' },
    { to: '/history', label: 'History', Icon: FiCalendar, isActive: (path: string) => path === '/history' },
    { to: '/templates', label: 'Templates', Icon: FiLayers, isActive: (path: string) => path.startsWith('/templates') },
    { to: '/programs', label: 'Plan AI', Icon: FiZap, isActive: (path: string) => path.startsWith('/programs') || path.startsWith('/ai-plan') },
] as const

const tabClass = "flex flex-col items-center justify-center gap-1 pt-2 pb-2.5 font-condensed text-[11px] font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"

export default function NavBarMobile() {
    const { pathname } = useLocation();
    const auth = useAuth();

    return (
        <>
            <header className="flex items-center justify-end gap-2 border-b border-platform-600 bg-platform-950 px-4 py-1.5 text-[11px] text-steel">
                <span className="truncate">{auth.user?.profile.email}</span>
                <button
                    type="button"
                    onClick={() => auth.signoutRedirect()}
                    aria-label="Sign out"
                    className="shrink-0 cursor-pointer text-steel transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <FiLogOut size={14} aria-hidden="true" />
                </button>
            </header>

            <nav
                aria-label="Main"
                className="fixed bottom-0 left-1/2 z-50 w-full max-w-[560px] -translate-x-1/2 border-t border-platform-600 bg-platform-950"
            >
                <div className="grid grid-cols-5">
                    {TABS.map(({ to, label, Icon, isActive }) => {
                        const active = isActive(pathname)
                        return (
                            <Link
                                key={to}
                                to={to}
                                aria-current={active ? 'page' : undefined}
                                className={`${tabClass} ${active ? 'text-accent' : 'text-steel-dark hover:text-steel'}`}
                            >
                                <Icon size={18} aria-hidden="true" />
                                <span>{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
