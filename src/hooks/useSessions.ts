import {useMutation, useQuery} from '@tanstack/react-query'
import { getSessions,getLastSession, createSession, endSession, getLastOngoingSession } from '../api/sessions'
import { useStore } from '../stores/StoreSession'
import axios from 'axios'

export const useSessions = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: getSessions,
    })
}

export const useLastSession = () => {
    return useQuery({
        queryKey: ['lastSession'],
        queryFn: getLastSession,
    })
}

export const useLastOngoingSession = () => {
    return useQuery({
        queryKey: ['lastOngoingSession'],
        queryFn: getLastOngoingSession,
        retry: (failureCount, error) => {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return false
            }
            return failureCount < 3
        }
    })
}

export const useCreateSession = () => {
    return useMutation({
        mutationFn: createSession,
        onSuccess: (data) => {
            useStore.getState().setOngoingSession(data)
        },
        onError: (error) => {
            console.error('Error creating session', error)
        }
    })
}

export const useFinishSession = () => {
    return useMutation({
        mutationFn: (sessionId: number) => endSession(sessionId),
        onSuccess: () => {
            useStore.getState().setOngoingSession(null)
        },
        onError: (error) => {
            console.error('Error finishing session', error)
        }
        
    })
}