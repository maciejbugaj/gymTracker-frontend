import { Link } from 'react-router-dom'
import { Badge, Button } from 'flowbite-react'
import { usePrograms } from '../hooks/useTrainingPrograms'
import type { ProgramStatus } from '../types'

const statusColor: Record<ProgramStatus, string> = {
    ACTIVE: 'purple',
    DRAFT: 'blue',
    ARCHIVED: 'gray',
}

export default function Programs() {
    const { data: programs, isLoading, error } = usePrograms()

    return (
        <div className="w-full px-4 pb-24">
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h1>Programs</h1>
                    <p className="text-gray-500 text-sm">AI-generated training programs</p>
                </div>
                <Link to="/ai-plan">
                    <Button size="xs" color="purple">+ Plan AI</Button>
                </Link>
            </div>

            {isLoading && <p className="text-gray-500 text-sm px-4">Loading…</p>}
            {error && <p className="text-red-400 text-sm px-4">Failed to load programs.</p>}

            {programs?.length === 0 && (
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 mx-2 text-center">
                    <p className="text-sm text-gray-400 mb-3">You don't have any programs yet.</p>
                    <Link to="/ai-plan">
                        <Button color="purple" size="sm">Generate your first program</Button>
                    </Link>
                </div>
            )}

            <div className="flex flex-col gap-2 px-2">
                {programs?.map(program => (
                    <Link
                        key={program.id}
                        to={`/programs/${program.id}`}
                        className="rounded-xl bg-gray-800 border border-gray-700 p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-100">{program.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {program.durationWeeks} weeks · {program.daysPerWeek}x/week
                            </p>
                        </div>
                        <Badge color={statusColor[program.status]}>{program.status}</Badge>
                    </Link>
                ))}
            </div>
        </div>
    )
}
