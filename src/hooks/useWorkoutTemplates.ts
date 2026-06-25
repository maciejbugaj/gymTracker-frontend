import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkoutTemplateById, getWorkoutTemplates, updateWorkoutTemplate, deleteWorkoutTemplate, createWorkoutTemplate } from '../api/workoutTemplates'
import type { UpdateWorkoutTemplateRequest, CreateWorkoutTemplateRequest } from '../types'
import { useNavigate } from 'react-router-dom'

export const useWorkoutTemplates = () => {
    return useQuery({
        queryKey: ['workoutTemplates'],
        queryFn: getWorkoutTemplates,
    })
}

export const useWorkoutTemplateById = (id: number | undefined) => {
    return useQuery({
        queryKey: ['workoutTemplate', id],
        enabled: !!id,
        queryFn: () => getWorkoutTemplateById(id!),
    })
}

export const useUpdateWorkoutTemplate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateWorkoutTemplateRequest }) =>
            updateWorkoutTemplate(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplates'] })
            queryClient.invalidateQueries({ queryKey: ['workoutTemplate', id] })
        },
    })
}

export const useDeleteWorkoutTemplate = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (id: number) => deleteWorkoutTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplates'] })
            navigate('/templates')
        },
    })
}

export const useCreateWorkoutTemplate = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (data: CreateWorkoutTemplateRequest) => createWorkoutTemplate(data),
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ['workoutTemplates'] })
            navigate(`/templates/${created.id}/edit`)
        },
    })
}
