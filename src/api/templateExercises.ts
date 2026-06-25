import client from './client'
import type { TemplateExercise, CreateTemplateExerciseRequest, UpdateTemplateExerciseRequest } from '../types'

export const createTemplateExercise = async (body: CreateTemplateExerciseRequest): Promise<TemplateExercise> => {
    const { data } = await client.post('/template-exercises', body)
    return data
}

export const updateTemplateExercise = async (id: number, body: UpdateTemplateExerciseRequest): Promise<TemplateExercise> => {
    const { data } = await client.put(`/template-exercises/${id}`, body)
    return data
}

export const deleteTemplateExercise = async (id: number): Promise<void> => {
    await client.delete(`/template-exercises/${id}`)
}
