import client from './client'
import type { WorkoutTemplate } from '../types'

export const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
    const { data } = await client.get('/workout-templates')
    return data
}

export const getWorkoutTemplateById = async (id: number): Promise<WorkoutTemplate> => {
    const { data } = await client.get(`/workout-templates/${id}`)
    return data
}