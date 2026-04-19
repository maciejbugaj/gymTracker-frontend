export interface WorkoutTemplate {
  id: number
  name: string
  description?: string
  createdAt: string
}

export interface TemplateExercise {
  id: number
  templateId: number
  exerciseName: string
  defaultSets?: number
  defaultReps?: number
  defaultWeightKg?: number
  sortOrder: number
}

export interface WorkoutSession {
  id: number
  templateId?: number
  startedAt: string
  endedAt?: string
  durationSeconds?: number
  notes?: string
}

export interface ExerciseLog {
  id: number
  sessionId: number
  exerciseName: string
  setNumber: number
  reps?: number
  weightKg?: number
  loggedAt: string
}