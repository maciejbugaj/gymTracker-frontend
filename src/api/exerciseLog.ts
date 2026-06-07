import type { ExerciseLog } from "../types";
import client from "./client";

export const logExerciseSet = async (exerciseLog: ExerciseLog): Promise<ExerciseLog> => {
    const { data } = await client.post(`/exercise-log`, exerciseLog)
    return data
}

export const getPreviousExerciseLogsByWorkoutTemplateId = async (workoutTemplateId: number): Promise<ExerciseLog[]> => {
    const { data } = await client.get(`/exercise-log/previous?workoutTemplateId=${workoutTemplateId}`)
    return data;
}
