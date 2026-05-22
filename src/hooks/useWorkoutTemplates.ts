import {useQuery} from '@tanstack/react-query'
import { getWorkoutTemplateById, getWorkoutTemplates } from '../api/workoutTemplates'

export const useWorkoutTemplates = () => {
    return useQuery({
        queryKey: ['workoutTemplates'],
        queryFn: getWorkoutTemplates,
    })
}

export const useWorkoutTemplateById = (id: number) => {
    return useQuery({
        queryKey: ['workoutTemplate', id],
        enabled:  !!id,
        queryFn: () => getWorkoutTemplateById(id),
    })
}
