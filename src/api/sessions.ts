import client from './client'
import type { WorkoutSession } from '../types'

export const getSessions = async (): Promise<WorkoutSession[]> => {
    const { data } = await client.get('/workout-sessions')
    return data
}

export const getLastSession = async (): Promise<WorkoutSession> => {
    const { data } = await client.get('/workout-sessions/last')
    return data
}