import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    activateProgram, archiveProgram, createProgramFromGeneration, deleteProgram,
    getActiveProgram, getProgramById, getPrograms, updateProgram,
} from '../api/trainingPrograms'
import type { TrainingProgramRequest } from '../types'
import { useNavigate } from 'react-router-dom'

export const usePrograms = () => {
    return useQuery({
        queryKey: ['trainingPrograms'],
        queryFn: getPrograms,
    })
}

export const useActiveProgram = () => {
    return useQuery({
        queryKey: ['activeProgram'],
        queryFn: getActiveProgram,
    })
}

export const useProgram = (id: number | undefined) => {
    return useQuery({
        queryKey: ['trainingProgram', id],
        enabled: !!id,
        queryFn: () => getProgramById(id!),
    })
}

function invalidateProgramQueries(queryClient: ReturnType<typeof useQueryClient>, id?: number) {
    queryClient.invalidateQueries({ queryKey: ['trainingPrograms'] })
    queryClient.invalidateQueries({ queryKey: ['activeProgram'] })
    if (id !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['trainingProgram', id] })
    }
}

export const useCreateProgramFromGeneration = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: ({ generationId, data }: { generationId: number; data: TrainingProgramRequest }) =>
            createProgramFromGeneration(generationId, data),
        onSuccess: (program) => {
            invalidateProgramQueries(queryClient)
            navigate(`/programs/${program.id}`)
        },
        onError: (error) => {
            console.error('Error saving training program', error)
        }
    })
}

export const useUpdateProgram = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TrainingProgramRequest }) => updateProgram(id, data),
        onSuccess: (_, { id }) => invalidateProgramQueries(queryClient, id),
    })
}

export const useActivateProgram = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => activateProgram(id),
        onSuccess: (_, id) => invalidateProgramQueries(queryClient, id),
    })
}

export const useArchiveProgram = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => archiveProgram(id),
        onSuccess: (_, id) => invalidateProgramQueries(queryClient, id),
    })
}

export const useDeleteProgram = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (id: number) => deleteProgram(id),
        onSuccess: () => {
            invalidateProgramQueries(queryClient)
            navigate('/programs')
        },
    })
}
