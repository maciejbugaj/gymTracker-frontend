export interface WorkoutTemplate {
  id: number
  name: string
  description?: string
  createdAt: string
  exercises: TemplateExercise[]
}

export interface TemplateExercise {
  id: number
  templateId: number
  exerciseName: string
  defaultSets?: number
  defaultReps?: number
  defaultWeight?: number
  sortOrder: number
}

export interface CreateSessionRequest { workoutTemplateId: number }

export interface WorkoutSession {
    id: number
    workoutTemplateId: number
    workoutTemplateName: string
    startedAt: string
    endedAt?: string
    durationSeconds?: number
    notes?: string
    exerciseLogs?: ExerciseLog[]
}

export interface ExerciseLog {
  id?: number
  workoutSessionId: number
  exerciseName: string
  setNumber?: number
  reps?: number
  weightKg?: number
  loggedAt?: string
}

export interface StoreState {
  ongoingSession: WorkoutSession | null
  setOngoingSession: (session: WorkoutSession | null) => void
}