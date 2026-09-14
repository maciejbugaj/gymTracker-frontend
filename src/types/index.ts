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

// Exactly one of the two must be provided (mirrors the backend's @AssertTrue check).
export interface CreateSessionRequest {
  workoutTemplateId?: number
  programDayId?: number
}

export interface WorkoutSession {
    id: number
    workoutTemplateId?: number
    workoutTemplateName?: string
    programDayId?: number
    programName?: string
    weekNumber?: number
    dayName?: string
    isDeload?: boolean
    prescribedExercises?: ProgramDayExerciseResponse[]
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

// The backend renumbers every listed set to 1..n in this exact order, so logIds must contain
// every saved set of that exercise in the session.
export interface ReorderExerciseSetsRequest {
  workoutSessionId: number
  exerciseName: string
  logIds: number[]
}

export interface StoreState {
  ongoingSession: WorkoutSession | null
  setOngoingSession: (session: WorkoutSession | null) => void
  // When the current rest break started, as epoch ms; null when no break is running.
  // Stored as a timestamp rather than a countdown so the remaining time is derived from the
  // wall clock — it stays right across re-renders and while the session screen is closed.
  breakStartedAt: number | null
  // How long the current break runs. Set from the plan's restSeconds for the exercise just
  // logged, and kept afterwards so the idle timer shows the length the next Start will use.
  breakDurationMs: number
  startBreak: (durationMs?: number) => void
  stopBreak: () => void
  // How many set rows the table shows per exercise, keyed by `${sessionId}:${exerciseName}`.
  // Only what the user changed by hand lives here — the default row count is derived from the
  // plan and the previous session on every render.
  setRowCounts: Record<string, number>
  setRowCount: (sessionId: number, exerciseName: string, rowCount: number) => void
}

export interface CreateWorkoutTemplateRequest {
  name: string
  description?: string
}

export interface UpdateWorkoutTemplateRequest {
  name: string
  description?: string
}

export interface CreateTemplateExerciseRequest {
  workoutTemplateId: number
  exerciseName: string
  defaultSets?: number
  defaultReps?: number
  defaultWeightKg?: number
  sortOrder: number
}

export interface UpdateTemplateExerciseRequest {
  workoutTemplateId: number
  exerciseName: string
  defaultSets?: number
  defaultReps?: number
  defaultWeightKg?: number
  sortOrder: number
}

export interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (token: string | null, isAuthenticated: boolean) => void
}

// --- AI-generated training plans ---

export type ProgramGoal = 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE' | 'GENERAL'
export type ProgramStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
export type ProgramSource = 'AI_GENERATED' | 'MANUAL'
export type AiPlanGenerationStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED'

export interface GeneratePlanRequest {
  goal: ProgramGoal
  experienceLevel?: string
  daysPerWeek: number
  durationWeeks: number
  sessionLengthMinutes: number
  equipment?: string[]
  splitPreference?: string
  focusMuscleGroups?: string[]
  exclusionsOrInjuries?: string
  notes?: string
}

export interface RegeneratePlanRequest {
  feedback: string
}

export interface GeneratedExercise {
  exerciseName: string
  sortOrder: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  restSeconds?: number
  notes?: string
}

export interface GeneratedDay {
  dayNumber: number
  name?: string
  notes?: string
  exercises: GeneratedExercise[]
}

export interface GeneratedWeek {
  weekNumber: number
  focus?: string
  isDeload: boolean
  notes?: string
  days: GeneratedDay[]
}

export interface GeneratedProgram {
  name: string
  description?: string
  goal: ProgramGoal
  durationWeeks: number
  daysPerWeek: number
  weeks: GeneratedWeek[]
  coachNotes?: string
}

export interface AiPlanGeneration {
  id: number
  status: AiPlanGenerationStatus
  program: GeneratedProgram | null
  errorMessage?: string | null
  inputTokens?: number | null
  outputTokens?: number | null
  createdAt: string
}

// --- Persisted training programs ---

export interface ProgramDayExerciseResponse {
  id: number
  exerciseName: string
  sortOrder: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  restSeconds?: number
  notes?: string
}

export interface ProgramDayResponse {
  id: number
  dayNumber: number
  name?: string
  notes?: string
  exercises: ProgramDayExerciseResponse[]
}

export interface ProgramWeekResponse {
  id: number
  weekNumber: number
  focus?: string
  isDeload: boolean
  notes?: string
  days: ProgramDayResponse[]
}

export interface TrainingProgram {
  id: number
  name: string
  description?: string
  goal: ProgramGoal
  experienceLevel?: string
  durationWeeks: number
  daysPerWeek: number
  status: ProgramStatus
  source: ProgramSource
  createdAt: string
  weeks: ProgramWeekResponse[]
}

export interface TrainingProgramSummary {
  id: number
  name: string
  goal: ProgramGoal
  status: ProgramStatus
  durationWeeks: number
  daysPerWeek: number
  createdAt: string
}

export interface NextProgramDay {
  programDayId: number
  weekNumber: number
  dayNumber: number
  dayName?: string
  isDeload: boolean
  exercises: ProgramDayExerciseResponse[]
}

export interface ActiveProgramResponse {
  program: TrainingProgramSummary
  nextDay: NextProgramDay | null
}

// Editable tree — used both to save a reviewed AI generation and to update an
// existing program (mirrors the backend's single TrainingProgramRequest).
export interface ProgramDayExerciseRequest {
  exerciseName: string
  sortOrder: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  restSeconds?: number
  notes?: string
}

export interface ProgramDayRequest {
  dayNumber: number
  name?: string
  notes?: string
  exercises: ProgramDayExerciseRequest[]
}

export interface ProgramWeekRequest {
  weekNumber: number
  focus?: string
  isDeload: boolean
  notes?: string
  days: ProgramDayRequest[]
}

export interface TrainingProgramRequest {
  name: string
  description?: string
  goal: ProgramGoal
  experienceLevel?: string
  durationWeeks: number
  daysPerWeek: number
  weeks: ProgramWeekRequest[]
}