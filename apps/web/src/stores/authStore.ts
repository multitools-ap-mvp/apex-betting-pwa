import { create } from 'zustand'

interface User {
  id: string
  email: string
  displayName: string
  role: string
  balance: number
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))
