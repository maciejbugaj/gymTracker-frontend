import client from './client'
import type { AiPlanGeneration, GeneratePlanRequest, RegeneratePlanRequest } from '../types'

export const startGeneration = async (request: GeneratePlanRequest): Promise<AiPlanGeneration> => {
    const { data } = await client.post('/ai-plans/generations', request)
    return data
}

export const getGeneration = async (id: number): Promise<AiPlanGeneration> => {
    const { data } = await client.get(`/ai-plans/generations/${id}`)
    return data
}

export const listGenerations = async (): Promise<AiPlanGeneration[]> => {
    const { data } = await client.get('/ai-plans/generations')
    return data
}

export const regenerate = async (id: number, request: RegeneratePlanRequest): Promise<AiPlanGeneration> => {
    const { data } = await client.post(`/ai-plans/generations/${id}/regenerate`, request)
    return data
}
