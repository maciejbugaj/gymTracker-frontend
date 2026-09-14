import { Link } from 'react-router-dom'
import { usePrograms } from '../hooks/useTrainingPrograms'
import StatusBadge from '../components/ui/StatusBadge'
import { buttonClass } from '../components/ui/buttonClass'

export default function Programs() {
    const { data: programs, isLoading, error } = usePrograms()

    return (
        <div className="w-full pb-24">
            <header className="flex items-start justify-between gap-3 px-4 pb-3 pt-5">
                <div>
                    <h1 className="font-condensed text-[26px] font-bold leading-none">Programs</h1>
                    <p className="mt-1 text-[12.5px] text-steel">Periodized blocks written for you.</p>
                </div>
                <Link to="/ai-plan" className={buttonClass('solid', 'sm')}>New plan</Link>
            </header>

            {isLoading && <p className="px-4 text-[13px] text-steel">Loading…</p>}

            {error && (
                <p role="alert" className="bg-platform-800 px-4 py-3 text-[13px] text-danger">
                    Your programs didn't load. Try again in a moment.
                </p>
            )}

            {programs?.length === 0 && (
                <div className="bg-platform-800 px-4 py-6 text-center">
                    <p className="text-[13px] text-steel">No programs yet.</p>
                    <Link to="/ai-plan" className={buttonClass('solid', 'md', 'mt-3')}>Generate your first program</Link>
                </div>
            )}

            <div className="flex flex-col gap-0.5">
                {programs?.map(program => (
                    <Link
                        key={program.id}
                        to={`/programs/${program.id}`}
                        className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-platform-750 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                            program.status === 'ACTIVE' ? 'border-l-[3px] border-good bg-platform-800 pl-[13px]' : 'bg-platform-800'
                        }`}
                    >
                        <span className="min-w-0">
                            <span className="block font-condensed text-[16px] font-semibold leading-tight">{program.name}</span>
                            <span className="mt-0.5 block text-[11.5px] text-steel">
                                <span className="font-medium text-chalk-dim">{program.durationWeeks}</span> weeks ·
                                <span className="font-medium text-chalk-dim"> {program.daysPerWeek}</span> days a week
                            </span>
                        </span>
                        <StatusBadge status={program.status} />
                    </Link>
                ))}
            </div>
        </div>
    )
}
