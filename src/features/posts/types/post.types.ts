import { z } from 'zod'

/** Các nền tảng mạng xã hội được hỗ trợ. */
export const PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin'] as const
export type Platform = (typeof PLATFORMS)[number]

/** Trạng thái vòng đời của một bài đăng. */
export const POST_STATUSES = ['draft', 'scheduled', 'published', 'failed'] as const
export type PostStatus = (typeof POST_STATUSES)[number]

/**
 * Schema validate dữ liệu Post trả về từ API.
 * Dùng Zod để vừa validate runtime, vừa suy ra type tĩnh (single source of truth).
 */
export const postSchema = z.object({
  id: z.string(),
  content: z.string(),
  platform: z.enum(PLATFORMS),
  status: z.enum(POST_STATUSES),
  scheduledAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type Post = z.infer<typeof postSchema>

/**
 * Schema cho form tạo/sửa bài đăng (React Hook Form + zodResolver).
 * Tách riêng khỏi `postSchema` vì input của người dùng khác với entity server.
 */
export const postFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Nội dung không được để trống')
    .max(2_200, 'Nội dung tối đa 2.200 ký tự'),
  platform: z.enum(PLATFORMS, {
    errorMap: () => ({ message: 'Vui lòng chọn nền tảng' }),
  }),
  // datetime-local trả về chuỗi 'YYYY-MM-DDTHH:mm' — chỉ cần khác rỗng.
  scheduledAt: z.string().min(1, 'Vui lòng chọn thời gian đăng'),
})

export type PostFormValues = z.infer<typeof postFormSchema>

/** Payload gửi lên API khi tạo/cập nhật. */
export interface PostPayload {
  content: string
  platform: Platform
  scheduledAt: string
}

/** Tham số lọc danh sách (truyền vào query). */
export interface PostListParams {
  search?: string
  platform?: Platform | 'all'
  status?: PostStatus | 'all'
}
