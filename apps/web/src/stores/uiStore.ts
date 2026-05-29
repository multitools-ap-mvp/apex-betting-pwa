import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  setSidebarOpen: (open: boolean) => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toast: null,

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  showToast: (message, type) => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 4000)
  },

  clearToast: () => set({ toast: null }),
}))
