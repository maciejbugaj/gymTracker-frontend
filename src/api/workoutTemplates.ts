import client from './client'
import type { WorkoutTemplate, UpdateWorkoutTemplateRequest, CreateWorkoutTemplateRequest } from '../types'

export const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
    const { data } = await client.get('/workout-templates')
    return data
}

export const getWorkoutTemplateById = async (id: number | undefined): Promise<WorkoutTemplate> => {
    const { data } = await client.get(`/workout-templates/${id}`)
    return data
}

export const updateWorkoutTemplate = async (id: number, body: UpdateWorkoutTemplateRequest): Promise<WorkoutTemplate> => {
    const { data } = await client.put(`/workout-templates/${id}`, body)
    return data
}

export const deleteWorkoutTemplate = async (id: number): Promise<void> => {
    await client.delete(`/workout-templates/${id}`)
}

export const createWorkoutTemplate = async (body: CreateWorkoutTemplateRequest): Promise<WorkoutTemplate> => {
    const { data } = await client.post('/workout-templates', body)
    return data
}