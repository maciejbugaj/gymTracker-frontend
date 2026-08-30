import {create} from 'zustand';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>()((set) => ({
    accessToken: null,
    isAuthenticated: false,
    setAuth: (accessToken, isAuthenticated) => set({ accessToken, isAuthenticated }),
}));