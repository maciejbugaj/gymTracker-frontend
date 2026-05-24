import { useMutation, useQuery } from "@tanstack/react-query"
import { getExerciseLogsBySessionId, getExerciseLogsByWorkoutTemplateId, logExerciseSet } from "../api/exerciseLog"
import type { ExerciseLog } from "../types"
import { sessionStore } from '../stores/StoreSession'

export const useLogExerciseSet = () => {
    return useMutation({
        mutationFn: (data: ExerciseLog) => logExerciseSet(data),
        onSuccess: (data: ExerciseLog) => {
            const prev = sessionStore.getState().ongoingSession;
            sessionStore.getState().setOngoingSession(prev ? { ...prev, exerciseLogs: [...(prev.exerciseLogs || []), data] } : prev);
        },
        onError: (error) => {
            console.error('Error logging exercise set', error)
        }
    })
}

export const useGetExerciseLogsBySessionId = (workoutSessionId: number) => {
    return useQuery({
        queryKey: ['exerciseLogsBySessionId', workoutSessionId],
        queryFn: () => getExerciseLogsBySessionId(workoutSessionId),
    })
}

export const useGetExerciseLogsByWorkoutTemplateId = (workoutTemplateId: number) => {
    return useQuery({
        queryKey: ['exerciseLogsByWorkoutTemplateId', workoutTemplateId],
        enabled: !!workoutTemplateId,
        queryFn: () => getExerciseLogsByWorkoutTemplateId(workoutTemplateId),
        })
}