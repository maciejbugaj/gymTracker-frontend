import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { getSessions,getLastSession, createSession, endSession, getLastOngoingSession } from '../api/sessions'
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

export const useFinishSession = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (sessionId: number) => endSession(sessionId),
        onSuccess: () => {
            queryClient.setQueryData(['lastOngoingSession'], null)
            useStore.getState().setOngoingSession(null)
            navigate('/')
        },
        onError: (error) => {
            console.error('Error finishing session', error)
        }
        
    })
}