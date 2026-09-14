import { create } from 'zustand';
import type { StoreState, WorkoutSession } from '../types';


export const sessionStore = create<StoreState>()((set) => ({
  ongoingSession: null,
  setOngoingSession: (session: WorkoutSession | null) => set({ ongoingSession: session }),
  setRowCounts: {},
  setRowCount: (sessionId: number, exerciseName: string, rowCount: number) =>
    set((state) => ({
      setRowCounts: { ...state.setRowCounts, [`${sessionId}:${exerciseName}`]: rowCount },
    })),
}))

export const useStore = sessionStore
