import client from './client'
import type { CreateSessionRequest, WorkoutSession } from '../types'

export const getSessions = async (): Promise<WorkoutSession[]> => {
    const { data } = await client.get('/workout-sessions')
    return data
}

export const getLastSession = async (): Promise<WorkoutSession> => {
    const { data } = await client.get('/workout-sessions/last')
    return data
}

export const getLastOngoingSession = async (): Promise<WorkoutSession> => {
    const { data } = await client.get('/workout-sessions/last/ongoing')
    return data
}

export const createSession = async (workoutSession: CreateSessionRequest): Promise<WorkoutSession> => {
    const { data } = await client.post('/workout-sessions', workoutSession)
    return data
}

export const endSession = async (sessionId: number): Promise<WorkoutSession> => {
    const { data } = await client.post(`/workout-sessions/${sessionId}/finish`)
    return data
}