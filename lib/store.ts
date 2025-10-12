import { create } from 'zustand';
import { User } from './types';

interface AppState {
  user: User | null;
  balance: number;
  setUser: (user: User | null) => void;
  setBalance: (balance: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  balance: 0,
  setUser: (user) => set({ user }),
  setBalance: (balance) => set({ balance }),
}));
