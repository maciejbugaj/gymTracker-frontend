import type { ExerciseLog, ReorderExerciseSetsRequest } from "../types";
import client from "./client";

export const logExerciseSet = async (exerciseLog: ExerciseLog): Promise<ExerciseLog> => {
    const { data } = await client.post(`/exercise-logs`, exerciseLog)
    return data
}

export const getPreviousExerciseLogsByWorkoutTemplateId = async (workoutTemplateId: number): Promise<ExerciseLog[]> => {
    const { data } = await client.get(`/exercise-logs/previous?workoutTemplateId=${workoutTemplateId}`)
    return data;
}

export const getPreviousExerciseLogsByProgramDayId = async (programDayId: number): Promise<ExerciseLog[]> => {
    const { data } = await client.get(`/exercise-logs/previous?programDayId=${programDayId}`)
    return data;
}

export const deleteExerciseSet = async (exerciseLogId: number): Promise<void> => {
    await client.delete(`/exercise-logs/${exerciseLogId}`)
}

export const reorderExerciseSets = async (request: ReorderExerciseSetsRequest): Promise<void> => {
    await client.put(`/exercise-logs/order`, request)
}
