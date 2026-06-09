import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import { useAuthStore } from '@/stores/auth-store'
import { loginRequest, logoutRequest } from '@/features/auth/api/auth.api'
import type { LoginPayload } from '@/features/auth/types/auth.types'

/** Mutation đăng nhập — lưu phiên vào store khi thành công. */
export const useLogin = () => {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken)
    },
    // Lỗi được hiển thị tại form (thông báo chung chung) — không toast để tránh lộ.
  })
}

/**
 * Mutation đăng xuất — gọi backend thu hồi phiên, dọn store và XOÁ toàn bộ cache
 * React Query để không rò rỉ dữ liệu của người dùng trước.
 */
export const useLogout = () => {
  const clearSession = useAuthStore((s) => s.clearSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logoutRequest(),
    // Dù backend lỗi vẫn dọn phiên phía client (đăng xuất luôn phải thành công với user).
    onSettled: () => {
      clearSession()
      queryClient.clear()
      notify.success('Đã đăng xuất')
    },
  })
}
