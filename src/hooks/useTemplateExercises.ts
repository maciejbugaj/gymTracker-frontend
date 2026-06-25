import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTemplateExercise, updateTemplateExercise, deleteTemplateExercise } from '../api/templateExercises'
import type { CreateTemplateExerciseRequest, UpdateTemplateExerciseRequest } from '../types'

export const useCreateTemplateExercise = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateTemplateExerciseRequest) => createTemplateExercise(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplate', variables.workoutTemplateId] })
        },
    })
}

export const useUpdateTemplateExercise = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTemplateExerciseRequest }) =>
            updateTemplateExercise(id, data),
        onSuccess: (_, { data }) => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplate', data.workoutTemplateId] })
        },
    })
}

export const useDeleteTemplateExercise = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id }: { id: number; templateId: number }) => deleteTemplateExercise(id),
        onSuccess: (_, { templateId }) => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplate', templateId] })
        },
    })
}
