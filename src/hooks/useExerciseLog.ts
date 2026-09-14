import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteExerciseSet, getPreviousExerciseLogsByProgramDayId, getPreviousExerciseLogsByWorkoutTemplateId, logExerciseSet, reorderExerciseSets } from "../api/exerciseLog"
import type { ExerciseLog } from "../types"
import { sessionStore } from '../stores/StoreSession'

export const useLogExerciseSet = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ExerciseLog) => logExerciseSet(data),
        onSuccess: (data: ExerciseLog) => {
            const prev = sessionStore.getState().ongoingSession;
            sessionStore.getState().setOngoingSession(prev ? { ...prev, exerciseLogs: [...(prev.exerciseLogs || []), data] } : prev);
            // The ongoing session (with its logs) is what the session screen renders from, so it
            // has to be refetched — otherwise navigating away and back restores a stale cache.
            queryClient.invalidateQueries({ queryKey: ['lastOngoingSession'] })
        },
        onError: (error) => {
            console.error('Error logging exercise set', error)
        }
    })
}

export interface RemoveSetRowVariables {
    workoutSessionId: number
    exerciseName: string
    /** The saved set to delete — absent when the removed row was never ticked. */
    logIdToDelete?: number
    /** Remaining saved sets in their new row order; omit when the rows below don't shift up. */
    renumberLogIds?: number[]
}

/**
 * Unticking a set deletes it and leaves the other rows where they are; removing a whole row also
 * shifts everything below it up, so the saved sets have to be renumbered to stay 1..n. Both steps
 * live in one mutation so the UI stays blocked until the pair is done.
 */
export const useRemoveSetRow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (variables: RemoveSetRowVariables) => {
            if (variables.logIdToDelete != null) {
                await deleteExerciseSet(variables.logIdToDelete)
            }
            if (variables.renumberLogIds && variables.renumberLogIds.length > 0) {
                await reorderExerciseSets({
                    workoutSessionId: variables.workoutSessionId,
                    exerciseName: variables.exerciseName,
                    logIds: variables.renumberLogIds,
                })
            }
            return variables
        },
        onSuccess: (variables: RemoveSetRowVariables) => {
            const prev = sessionStore.getState().ongoingSession
            if (!prev) return

            const renumbered = variables.renumberLogIds ?? []
            const exerciseLogs = (prev.exerciseLogs ?? [])
                .filter(log => log.id !== variables.logIdToDelete)
                .map(log => {
                    const newIndex = log.id != null ? renumbered.indexOf(log.id) : -1
                    return newIndex === -1 ? log : { ...log, setNumber: newIndex + 1 }
                })

            sessionStore.getState().setOngoingSession({ ...prev, exerciseLogs })
            queryClient.invalidateQueries({ queryKey: ['lastOngoingSession'] })
        },
        onError: (error) => {
            console.error('Error removing exercise set', error)
        }
    })
}

export const useGetExerciseLogsByWorkoutTemplateId = (workoutTemplateId: number | undefined) => {
    return useQuery({
        queryKey: ['exerciseLogsByWorkoutTemplateId', workoutTemplateId],
        enabled: !!workoutTemplateId,
        queryFn: () => getPreviousExerciseLogsByWorkoutTemplateId(workoutTemplateId!),
    })
}

export const useGetExerciseLogsByProgramDayId = (programDayId: number | undefined) => {
    return useQuery({
        queryKey: ['exerciseLogsByProgramDayId', programDayId],
        enabled: !!programDayId,
        queryFn: () => getPreviousExerciseLogsByProgramDayId(programDayId!),
    })
}
