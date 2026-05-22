import { create } from 'zustand';
import type { StoreState, WorkoutSession } from '../types';


export const sessionStore = create<StoreState>()((set) => ({
  ongoingSession: null,
  setOngoingSession: (session: WorkoutSession | null) => set({ ongoingSession: session }),
}))

export const useStore = sessionStore
