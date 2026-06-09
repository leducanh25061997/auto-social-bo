import { apiClient } from '@/lib/api-client'
import { userSchema } from '@/features/auth/types/auth.types'
import type {
  CreateUserPayload,
  PaginatedUsers,
  UpdateUserPayload,
  User,
  UserListParams,
} from '@/features/users/types/user.types'

/** Envelope chuẩn của backend cho response thành công. */
interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

/** GET /users — danh sách phân trang + lọc (ADMIN). */
export const getUsers = async (params: UserListParams): Promise<PaginatedUsers> => {
  const res = await apiClient.get<ApiEnvelope<PaginatedUsers>>('/users', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      role: params.role && params.role !== 'all' ? params.role : undefined,
    },
  })
  // Validate từng user để fail-fast khi schema lệch backend.
  return { ...res.data, items: res.data.items.map((u) => userSchema.parse(u)) }
}

/** POST /users — tạo user. */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await apiClient.post<ApiEnvelope<{ user: User }>>('/users', {
    body: payload,
  })
  return userSchema.parse(res.data.user)
}

/** PATCH /users/:id — cập nhật user. */
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const res = await apiClient.patch<ApiEnvelope<{ user: User }>>(`/users/${id}`, {
    body: payload,
  })
  return userSchema.parse(res.data.user)
}

/** DELETE /users/:id — xoá user. */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}

/** POST /users/:id/reset-password — admin đặt lại mật khẩu. */
export const resetUserPassword = async (id: string, password: string): Promise<void> => {
  await apiClient.post(`/users/${id}/reset-password`, { body: { password } })
}
