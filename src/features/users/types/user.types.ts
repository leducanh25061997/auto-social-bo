import { z } from 'zod'

import { USER_ROLES, type User, type UserRole } from '@/features/auth/types/auth.types'

// Dùng lại entity User + role enum từ module auth (single source of truth).
export type { User, UserRole }
export { USER_ROLES }

/** Tham số lọc/phân trang danh sách user (khớp query backend). */
export interface UserListParams {
  page: number
  limit: number
  search?: string
  role?: UserRole | 'all'
}

/** Response danh sách có phân trang từ backend (`data` của envelope). */
export interface PaginatedUsers {
  items: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ── Ràng buộc field đồng bộ với backend (auto-social-api) ───────────────────
const usernameField = z
  .string()
  .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
  .max(32, 'Tên đăng nhập tối đa 32 ký tự')
  .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ gồm chữ, số và dấu gạch dưới')

const passwordField = z
  .string()
  .min(8, 'Mật khẩu tối thiểu 8 ký tự')
  .max(128, 'Mật khẩu tối đa 128 ký tự')
  .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
  .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
  .regex(/[0-9]/, 'Cần ít nhất 1 chữ số')

// Email tuỳ chọn: chuỗi rỗng -> undefined (không gửi lên).
const optionalEmail = z
  .string()
  .email('Email không hợp lệ')
  .or(z.literal(''))
  .optional()

const optionalName = z.string().max(100, 'Tên tối đa 100 ký tự').optional()
const roleField = z.enum(USER_ROLES)

/** Form tạo user (admin). */
export const createUserSchema = z.object({
  username: usernameField,
  name: optionalName,
  email: optionalEmail,
  password: passwordField,
  role: roleField,
})
export type CreateUserFormValues = z.infer<typeof createUserSchema>

/**
 * Form sửa user (admin). Giữ CÙNG shape với form tạo (để dùng chung 1 useForm)
 * nhưng username/password chỉ là placeholder bị ẩn & không ràng buộc khi sửa.
 */
export const updateUserSchema = z.object({
  username: z.string(),
  name: optionalName,
  email: optionalEmail,
  password: z.string(),
  role: roleField,
})
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>

/** Form đặt lại mật khẩu (admin). */
export const resetPasswordSchema = z.object({
  password: passwordField,
})
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

/** Payload gửi API tạo user. */
export interface CreateUserPayload {
  username: string
  name?: string
  email?: string
  password: string
  role: UserRole
}

/** Payload gửi API cập nhật user. */
export interface UpdateUserPayload {
  name?: string | null
  email?: string | null
  role?: UserRole
}
