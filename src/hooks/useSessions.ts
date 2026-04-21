import {useQuery} from '@tanstack/react-query'
import { getSessions,getLastSession } from '../api/sessions'

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