import { create } from 'zustand'
import type { GeneratedExercise, GeneratedProgram } from '../types'

interface AiPlanDraftState {
  draft: GeneratedProgram | null
  loadDraft: (program: GeneratedProgram) => void
  updateExercise: (
    weekIndex: number,
    dayIndex: number,
    exerciseIndex: number,
    patch: Partial<Pick<GeneratedExercise, 'targetSets' | 'targetRepsMin' | 'targetRepsMax'>>
  ) => void
  clearDraft: () => void
}

// Holds an editable copy of a generated program so the preview page can tweak
// sets/reps inline without mutating the AiPlanGeneration query's cached data.
export const useAiPlanDraftStore = create<AiPlanDraftState>()((set) => ({
  draft: null,

  loadDraft: (program) => set({ draft: structuredClone(program) }),

  updateExercise: (weekIndex, dayIndex, exerciseIndex, patch) =>
    set((state) => {
      if (!state.draft) return state
      const draft = structuredClone(state.draft)
      const exercise = draft.weeks[weekIndex]?.days[dayIndex]?.exercises[exerciseIndex]
      if (exercise) Object.assign(exercise, patch)
      return { draft }
    }),

  clearDraft: () => set({ draft: null }),
}))
