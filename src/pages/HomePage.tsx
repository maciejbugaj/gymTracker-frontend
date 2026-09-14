import { useCreateSession, useLastOngoingSession, useLastSession } from '../hooks/useSessions'
import LastSessionCard from '../components/LastSessionCard';
import NewSessionCard from '../components/NewSessionCard';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { useActiveProgram } from '../hooks/useTrainingPrograms';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkoutTemplate } from '../types';
import { useSyncOngoingSession } from '../hooks/useSyncOngoingSession';
import OngoingSessionCard from '../components/OngoingSessionCard';
import Button from '../components/ui/Button';

const SECTION_CLASS = 'px-4 pb-2 pt-5 font-condensed text-[14px] font-semibold text-steel'

const TODAY_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }

export default function HomePage() {
    const { data: session, isLoading: isLoadingSession, error: errorSession } = useLastSession()
    const { data: ongoingSession } = useLastOngoingSession()
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()
    const { data: activeProgram } = useActiveProgram()
    const { mutate: createSession } = useCreateSession()
    const [workoutTemplateToStart, setWorkoutTemplateToStart] = useState<WorkoutTemplate | null>(null)

    const startSession = () => {
        if (workoutTemplateToStart) {
            createSession({
                workoutTemplateId: workoutTemplateToStart.id
            })
        }
    }

    const startProgramDay = () => {
        if (activeProgram?.nextDay) {
            createSession({ programDayId: activeProgram.nextDay.programDayId })
        }
    }

    useSyncOngoingSession();

    return (
        <div className="w-full pb-24">
            <header className="px-4 pb-3 pt-5">
                <p className="font-condensed text-[12px] font-semibold text-steel">
                    {new Date().toLocaleDateString(undefined, TODAY_FORMAT)}
                </p>
                <h1 className="mt-1 font-condensed text-[26px] font-bold leading-none">Gym Tracker</h1>
            </header>

            {ongoingSession && <OngoingSessionCard session={ongoingSession} />}

            {activeProgram && (
                <>
                    <h2 className={SECTION_CLASS}>Training block</h2>
                    <div className="border-l-[3px] border-plate-20 bg-platform-800 px-4 py-3">
                        <Link
                            to={`/programs/${activeProgram.program.id}`}
                            className="font-condensed text-[16px] font-semibold leading-tight hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            {activeProgram.program.name}
                        </Link>
                        {activeProgram.nextDay ? (
                            <>
                                <p className="mt-1 text-[11.5px] text-steel">
                                    Next up: week <span className="font-medium text-chalk-dim">{activeProgram.nextDay.weekNumber}</span>,
                                    day <span className="font-medium text-chalk-dim">{activeProgram.nextDay.dayNumber}</span>
                                    {activeProgram.nextDay.dayName ? ` — ${activeProgram.nextDay.dayName}` : ''}
                                    {activeProgram.nextDay.isDeload ? ' · deload week' : ''}
                                </p>
                                <Button
                                    className="mt-3 w-full"
                                    size="sm"
                                    onClick={startProgramDay}
                                    disabled={!!ongoingSession}
                                >
                                    Start {activeProgram.nextDay.dayName ?? `day ${activeProgram.nextDay.dayNumber}`}
                                </Button>
                            </>
                        ) : (
                            <p className="mt-1 text-[11.5px] text-steel">Every day in this block is done. Pick a new program to keep going.</p>
                        )}
                    </div>
                </>
            )}

            <h2 className={SECTION_CLASS}>Last session</h2>
            <LastSessionCard
                session={session}
                isLoading={isLoadingSession}
                error={errorSession}
                description={workoutTemplates?.find(t => t.id === session?.workoutTemplateId)?.description}
            />

            <h2 className={SECTION_CLASS}>Start a session</h2>
            <div className="flex flex-col gap-0.5">
                {workoutTemplates?.map(template => (
                    <NewSessionCard
                        key={template.id}
                        template={template}
                        isLoading={isLoadingTemplates}
                        error={errorTemplates}
                        isSelected={workoutTemplateToStart?.id === template.id}
                        setWorkoutTemplateToStart={setWorkoutTemplateToStart}
                    />
                ))}
                {(isLoadingTemplates || errorTemplates || workoutTemplates?.length === 0) && (
                    <NewSessionCard template={undefined} isLoading={isLoadingTemplates} error={errorTemplates} />
                )}
            </div>

            <div className="px-4 pt-4">
                {ongoingSession ? (
                    <p className="text-[13px] text-steel">Finish or discard the session in progress before starting a new one.</p>
                ) : workoutTemplateToStart ? (
                    <Button size="lg" className="w-full" onClick={startSession}>
                        Start {workoutTemplateToStart.name}
                    </Button>
                ) : (
                    <p className="text-[13px] text-steel">Pick a template above to start a session.</p>
                )}
            </div>
        </div>
    )
}
