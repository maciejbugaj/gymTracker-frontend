import client from './client'
import type { ActiveProgramResponse, TrainingProgram, TrainingProgramRequest, TrainingProgramSummary } from '../types'

export const getPrograms = async (): Promise<TrainingProgramSummary[]> => {
    const { data } = await client.get('/training-programs')
    return data
}

export const getActiveProgram = async (): Promise<ActiveProgramResponse | null> => {
    const { data, status } = await client.get('/training-programs/active', {
        validateStatus: (s) => s === 200 || s === 204,
    })
    return status === 204 ? null : data
}

export const getProgramById = async (id: number): Promise<TrainingProgram> => {
    const { data } = await client.get(`/training-programs/${id}`)
    return data
}

export const createProgramFromGeneration = async (generationId: number, request: TrainingProgramRequest): Promise<TrainingProgram> => {
    const { data } = await client.post(`/training-programs/from-generation/${generationId}`, request)
    return data
}

export const updateProgram = async (id: number, request: TrainingProgramRequest): Promise<TrainingProgram> => {
    const { data } = await client.put(`/training-programs/${id}`, request)
    return data
}

export const deleteProgram = async (id: number): Promise<void> => {
    await client.delete(`/training-programs/${id}`)
}

export const activateProgram = async (id: number): Promise<TrainingProgram> => {
    const { data } = await client.post(`/training-programs/${id}/activate`)
    return data
}

export const archiveProgram = async (id: number): Promise<TrainingProgram> => {
    const { data } = await client.post(`/training-programs/${id}/archive`)
    return data
}
