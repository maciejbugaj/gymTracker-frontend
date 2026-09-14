import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSessions, getLastSession, createSession, endSession, getLastOngoingSession, discardSession } from '../api/sessions'
import { useStore } from '../stores/StoreSession'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate()
    return useMutation({
        mutationFn: createSession,
        onSuccess: (data) => {
            useStore.getState().setOngoingSession(data)
            navigate('/session')
        },
        onError: (error) => {
            console.error('Error creating session', error)
        }
    })
}

/** Deletes a session the user never meant to start, so the home screen is free again. */
export const useDiscardSession = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (sessionId: number) => discardSession(sessionId),
        onSuccess: () => {
            queryClient.setQueryData(['lastOngoingSession'], null)
            useStore.getState().setOngoingSession(null)
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['lastSession'] })
        },
        onError: (error) => {
            console.error('Error discarding session', error)
        }
    })
}

export const useFinishSession = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (sessionId: number) => endSession(sessionId),
        onSuccess: () => {
            queryClient.setQueryData(['lastOngoingSession'], null)
            queryClient.invalidateQueries({ queryKey: ['lastSession'] })
            useStore.getState().setOngoingSession(null)
            navigate('/')
        },
        onError: (error) => {
            console.error('Error finishing session', error)
        }

    })
}