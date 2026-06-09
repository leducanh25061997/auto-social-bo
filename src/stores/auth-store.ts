import { create } from 'zustand'

import { setAccessToken } from '@/lib/auth-token'
import type { AuthStatus, User } from '@/features/auth/types/auth.types'

interface AuthState {
  user: User | null
  status: AuthStatus
  /** Lưu phiên sau khi login/refresh thành công (token vào memory). */
  setSession: (user: User, accessToken: string) => void
  /** Xoá phiên (đăng xuất / refresh thất bại). */
  clearSession: () => void
  /** Đánh dấu đã kết thúc giai đoạn boot mà không có phiên. */
  setUnauthenticated: () => void
  /** Cập nhật thông tin user hiện tại (vd: sau khi sửa hồ sơ) — giữ nguyên token. */
  setUser: (user: User) => void
}

/**
 * Store xác thực — CỐ Ý KHÔNG persist: user nhạy cảm và access token chỉ tồn tại
 * trong RAM. Khi reload, phiên được khôi phục qua silent refresh (refresh token đã lưu).
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setSession: (user, accessToken) => {
    setAccessToken(accessToken)
    set({ user, status: 'authenticated' })
  },
  clearSession: () => {
    setAccessToken(null)
    set({ user: null, status: 'unauthenticated' })
  },
  setUnauthenticated: () => set({ status: 'unauthenticated' }),
  setUser: (user) => set({ user }),
}))
