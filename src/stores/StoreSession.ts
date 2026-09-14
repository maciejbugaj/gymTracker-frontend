import { create } from 'zustand';
import type { StoreState, WorkoutSession } from '../types';

/** Used for template sessions and for any planned exercise with no restSeconds of its own. */
export const DEFAULT_BREAK_MS = 90 * 1000


export const sessionStore = create<StoreState>()((set) => ({
  ongoingSession: null,
  // Ending a session (finish or discard) also stops the rest clock, so a timer never keeps
  // running for a workout that is over.
  setOngoingSession: (session: WorkoutSession | null) =>
    set(session ? { ongoingSession: session } : { ongoingSession: null, breakStartedAt: null }),
  breakStartedAt: null,
  breakDurationMs: DEFAULT_BREAK_MS,
  // Called without a length, the break repeats whatever ran last — that is what the idle
  // timer is showing, so the manual Start button gives you the number you can see.
  startBreak: (durationMs?: number) =>
    set((state) => ({
      breakStartedAt: Date.now(),
      breakDurationMs: durationMs ?? state.breakDurationMs,
    })),
  stopBreak: () => set({ breakStartedAt: null }),
  setRowCounts: {},
  setRowCount: (sessionId: number, exerciseName: string, rowCount: number) =>
    set((state) => ({
      setRowCounts: { ...state.setRowCounts, [`${sessionId}:${exerciseName}`]: rowCount },
    })),
}))

export const useStore = sessionStore
