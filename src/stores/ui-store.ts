import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface UiState {
  /** Sidebar có đang thu gọn không (chỉ áp dụng desktop). */
  sidebarCollapsed: boolean
  theme: Theme
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/**
 * Client state toàn cục cho UI (sidebar + theme).
 * Dùng `persist` để giữ lựa chọn của người dùng qua các phiên.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'auto-social-bo-ui',
    },
  ),
)
