import { z } from 'zod'

/**
 * Tài khoản Instagram trả về từ API (đã loại bỏ accessToken ở backend).
 */
export const instagramAccountSchema = z.object({
  id: z.string(),
  igUserId: z.string(),
  username: z.string(),
  name: z.string().nullable().optional(),
  picture: z.string().nullable(),
  tokenExpiresAt: z.string().nullable().optional(),
  isActive: z.boolean(),
  lastRefreshedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type InstagramAccount = z.infer<typeof instagramAccountSchema>

/** Tham số lọc/phân trang (khớp query backend). */
export interface InstagramAccountListParams {
  page: number
  limit: number
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

/** Response danh sách phân trang (`data` của envelope). */
export interface PaginatedInstagramAccounts {
  items: InstagramAccount[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Form đổi tên hiển thị tài khoản. */
export const editInstagramAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên không được để trống')
    .max(100, 'Tên tối đa 100 ký tự'),
})

export type EditInstagramAccountFormValues = z.infer<typeof editInstagramAccountSchema>

/** BƯỚC 1 — đổi code lấy hồ sơ xem trước (token giữ ở backend). */
export interface ExchangeInstagramPayload {
  code: string
  redirectUri: string
}

/** Hồ sơ xem trước trả về từ bước exchange. */
export interface InstagramConnectPreview {
  pendingId: string
  externalId: string
  username: string
  name: string | null
  picture: string | null
}

/** BƯỚC 2 — xác nhận tạo tài khoản từ pendingId, có thể đặt tên hiển thị. */
export interface ConnectInstagramPayload {
  pendingId: string
  name?: string
}
