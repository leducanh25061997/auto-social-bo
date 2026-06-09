import { apiClient } from '@/lib/api-client'
import { userSchema, type User } from '@/features/auth/types/auth.types'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/features/profile/types/profile.types'

interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

/** PATCH /auth/me — cập nhật hồ sơ của chính mình. */
export const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const res = await apiClient.patch<ApiEnvelope<{ user: User }>>('/auth/me', {
    body: payload,
  })
  return userSchema.parse(res.data.user)
}

/** POST /auth/change-password — đổi mật khẩu của chính mình. */
export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
  await apiClient.post('/auth/change-password', { body: payload })
}
