import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getGeneration, listGenerations, regenerate, startGeneration } from '../api/aiPlans'
import type { GeneratePlanRequest } from '../types'
import { useNavigate } from 'react-router-dom'

export const useStartGeneration = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (data: GeneratePlanRequest) => startGeneration(data),
        onSuccess: (generation) => {
            navigate(`/ai-plans/${generation.id}`)
        },
        onError: (error) => {
            console.error('Error starting AI plan generation', error)
        }
    })
}

export const useGeneration = (id: number | undefined) => {
    return useQuery({
        queryKey: ['aiPlanGeneration', id],
        enabled: !!id,
        queryFn: () => getGeneration(id!),
        refetchInterval: (query) => (query.state.data?.status === 'PENDING' ? 2000 : false),
    })
}

export const useGenerations = () => {
    return useQuery({
        queryKey: ['aiPlanGenerations'],
        queryFn: listGenerations,
    })
}

export const useRegenerate = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: ({ id, feedback }: { id: number; feedback: string }) => regenerate(id, { feedback }),
        onSuccess: (generation) => {
            queryClient.invalidateQueries({ queryKey: ['aiPlanGenerations'] })
            navigate(`/ai-plans/${generation.id}`)
        },
        onError: (error) => {
            console.error('Error regenerating AI plan', error)
        }
    })
}
