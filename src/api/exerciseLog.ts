import type { ExerciseLog } from "../types";
import client from "./client";

export const logExerciseSet = async (exerciseLog: ExerciseLog): Promise<ExerciseLog> => {
    const { data } = await client.post(`/exercise-logs`, exerciseLog)
    return data
}

export const getPreviousExerciseLogsByWorkoutTemplateId = async (workoutTemplateId: number): Promise<ExerciseLog[]> => {
    const { data } = await client.get(`/exercise-logs/previous?workoutTemplateId=${workoutTemplateId}`)
    return data;
}
