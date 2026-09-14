import { useStore } from '../stores/StoreSession'
import { Card } from 'flowbite-react';
import { useWorkoutTemplateById } from '../hooks/useWorkoutTemplates';
import { useGetExerciseLogsByProgramDayId, useGetExerciseLogsByWorkoutTemplateId } from '../hooks/useExerciseLog';
import ExerciseSetsTable from './ExerciseSetsTable';

type ExerciseTarget = {
    key: number
    exerciseName: string
    setsTarget?: number
    repsPlaceholder: string
}

export default function LogExerciseCard() {

    const exerciseLogs = useStore((state) => state.ongoingSession?.exerciseLogs) ?? []
    const sessionId = useStore((state) => state.ongoingSession?.id)
    const workoutTemplateId = useStore((state) => state.ongoingSession?.workoutTemplateId)
    const programDayId = useStore((state) => state.ongoingSession?.programDayId)
    const prescribedExercises = useStore((state) => state.ongoingSession?.prescribedExercises)
    const { data: previousFromTemplate } = useGetExerciseLogsByWorkoutTemplateId(workoutTemplateId)
    const { data: previousFromProgram } = useGetExerciseLogsByProgramDayId(programDayId)
    const { data: workoutTemplate } = useWorkoutTemplateById(workoutTemplateId)

    const previousExerciseLogs = programDayId ? previousFromProgram : previousFromTemplate

    // Same list either way — just sourced from the program day's prescription (sets ×
    // rep range) instead of the template's defaults (single set/rep numbers).
    const exercisesToLog: ExerciseTarget[] = programDayId
        ? (prescribedExercises ?? []).map(exercise => ({
            key: exercise.id,
            exerciseName: exercise.exerciseName,
            setsTarget: exercise.targetSets,
            repsPlaceholder: `${exercise.targetRepsMin}-${exercise.targetRepsMax}`,
        }))
        : (workoutTemplate?.exercises ?? []).map(exercise => ({
            key: exercise.id,
            exerciseName: exercise.exerciseName,
            setsTarget: exercise.defaultSets,
            repsPlaceholder: exercise.defaultReps ? String(exercise.defaultReps) : '8',
        }))

    if (!sessionId) return null

    return (
        <>
            {exercisesToLog.map(exercise => {
                const currentLogs = exerciseLogs.filter(log => log.exerciseName === exercise.exerciseName)
                const previousLogs = (previousExerciseLogs ?? [])
                    .filter(log => log.exerciseName === exercise.exerciseName)
                    .sort((a, b) => (a.setNumber ?? 0) - (b.setNumber ?? 0))

                return (
                    <Card key={exercise.key} className='mt-2 mb-2'>
                        <div className='flex items-center justify-between'>
                            <h2 className="text-base font-semibold text-gray-100 tracking-tight normal-case">{exercise.exerciseName}</h2>
                            <span className="stat-number text-sm text-violet-400">
                                {currentLogs.length}
                                <span className="text-gray-600">/{exercise.setsTarget}</span>
                            </span>
                        </div>
                        <ExerciseSetsTable
                            sessionId={sessionId}
                            exerciseName={exercise.exerciseName}
                            setsTarget={exercise.setsTarget}
                            repsPlaceholder={exercise.repsPlaceholder}
                            previousLogs={previousLogs}
                            currentLogs={currentLogs}
                        />
                    </Card>
                )
            })}
        </>
    )

}
