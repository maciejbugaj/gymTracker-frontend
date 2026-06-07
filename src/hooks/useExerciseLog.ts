import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPreviousExerciseLogsByWorkoutTemplateId, logExerciseSet } from "../api/exerciseLog"
import type { ExerciseLog } from "../types"
import { sessionStore } from '../stores/StoreSession'

export const useLogExerciseSet = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ExerciseLog) => logExerciseSet(data),
        onSuccess: (data: ExerciseLog) => {
            const prev = sessionStore.getState().ongoingSession;
            sessionStore.getState().setOngoingSession(prev ? { ...prev, exerciseLogs: [...(prev.exerciseLogs || []), data] } : prev);
            queryClient.invalidateQueries({ queryKey: ['exerciseLogsBySessionId',data.workoutSessionId] })
        },
        onError: (error) => {
            console.error('Error logging exercise set', error)
        }
    })
}

export const useGetExerciseLogsByWorkoutTemplateId = (workoutTemplateId: number | undefined) => {
    return useQuery({
        queryKey: ['exerciseLogsByWorkoutTemplateId', workoutTemplateId],
        enabled: !!workoutTemplateId,
        queryFn: () => getPreviousExerciseLogsByWorkoutTemplateId(workoutTemplateId),
    })
}