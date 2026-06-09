import { z } from 'zod'

/**
 * Vai trò người dùng — KHỚP với enum `Role` của backend (prisma: USER | ADMIN).
 * Dùng cho phân quyền (RBAC) phía UI.
 */
export const USER_ROLES = ['USER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

/**
 * Schema user trả về từ API (validate runtime + suy ra type).
 * Khớp `SafeUser` của backend: KHÔNG có password; email/name có thể null.
 */
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  name: z.string().nullable().optional(),
  role: z.enum(USER_ROLES),
  // Backend hiện chưa trả avatarUrl — để optional cho tương thích về sau.
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type User = z.infer<typeof userSchema>

/**
 * Schema form đăng nhập — đăng nhập bằng `username` (khớp backend).
 * Ràng buộc cơ bản cho UX; backend mới là nguồn xác thực chuẩn.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
    .max(32, 'Tên đăng nhập tối đa 32 ký tự'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Payload gửi lên API đăng nhập. */
export interface LoginPayload {
  username: string
  password: string
  rememberMe?: boolean
}

/**
 * Phản hồi đăng nhập/refresh (đã chuẩn hoá ở tầng api):
 * frontend dùng `accessToken` (giữ trong RAM) + `user`.
 *
 * LƯU Ý BẢO MẬT: backend này trả `refreshToken` trong body (KHÔNG phải httpOnly
 * cookie), nên refresh token được lưu ở web storage — xem `api/refresh-token-store`.
 */
export interface AuthResponse {
  user: User
  accessToken: string
}

/** Trạng thái xác thực toàn cục. */
export type AuthStatus =
  | 'idle' // chưa khởi tạo (đang chờ silent refresh lúc boot)
  | 'authenticated'
  | 'unauthenticated'
