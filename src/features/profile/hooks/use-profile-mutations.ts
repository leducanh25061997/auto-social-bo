import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import { useAuthStore } from '@/stores/auth-store'
import { refreshTokenStore } from '@/features/auth/api/refresh-token-store'
import { changePassword, updateProfile } from '@/features/profile/api/profile.api'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/features/profile/types/profile.types'

/** Cập nhật hồ sơ — đồng bộ user mới vào store (không đổi token). */
export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user)
      notify.success('Đã cập nhật hồ sơ')
    },
    onError: (error) => notify.apiError(error, 'Cập nhật hồ sơ thất bại'),
  })
}

/**
 * Đổi mật khẩu. Backend thu hồi mọi phiên -> sau khi đổi, ta dọn phiên phía client
 * để buộc đăng nhập lại (component sẽ điều hướng tới /login).
 */
export const useChangePassword = () => {
  const clearSession = useAuthStore((s) => s.clearSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      clearSession()
      refreshTokenStore.clear()
      queryClient.clear()
      notify.success('Đã đổi mật khẩu', 'Vui lòng đăng nhập lại bằng mật khẩu mới.')
    },
    onError: (error) => notify.apiError(error, 'Đổi mật khẩu thất bại'),
  })
}
