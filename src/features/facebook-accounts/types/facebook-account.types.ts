import { z } from 'zod'

/**
 * Tài khoản Facebook trả về từ API (đã loại bỏ accessToken ở backend).
 * Dùng Zod để vừa validate runtime, vừa suy ra type tĩnh.
 */
export const facebookAccountSchema = z.object({
  id: z.string(),
  fbUserId: z.string(),
  name: z.string(),
  picture: z.string().nullable(),
  tokenExpiresAt: z.string().nullable().optional(),
  isActive: z.boolean(),
  lastRefreshedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type FacebookAccount = z.infer<typeof facebookAccountSchema>

/** Một Page mà tài khoản Facebook quản trị. */
export const facebookPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string().nullable(),
  category: z.string().nullable(),
})

export type FacebookPage = z.infer<typeof facebookPageSchema>

/** Tham số lọc/phân trang (khớp query backend). `limit` bỏ trống -> lấy hết. */
export interface FacebookAccountListParams {
  page: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

/** Response danh sách phân trang (`data` của envelope). */
export interface PaginatedFacebookAccounts {
  items: FacebookAccount[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Form đổi tên hiển thị tài khoản. */
export const editFacebookAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên không được để trống')
    .max(100, 'Tên tối đa 100 ký tự'),
})

export type EditFacebookAccountFormValues = z.infer<typeof editFacebookAccountSchema>

/** BƯỚC 1 — đổi code lấy hồ sơ xem trước (token giữ ở backend). */
export interface ExchangeFacebookPayload {
  code: string
  redirectUri: string
}

/** Hồ sơ xem trước trả về từ bước exchange. */
export interface FacebookConnectPreview {
  pendingId: string
  externalId: string
  name: string
  picture: string | null
}

/** BƯỚC 2 — xác nhận tạo tài khoản từ pendingId, có thể đặt tên hiển thị. */
export interface ConnectFacebookPayload {
  pendingId: string
  name?: string
}
