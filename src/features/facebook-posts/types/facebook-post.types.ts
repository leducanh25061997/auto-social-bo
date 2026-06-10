import { z } from 'zod'

/** Trạng thái vòng đời 1 bài đăng. */
export const FACEBOOK_POST_STATUSES = [
  'draft',
  'scheduled',
  'processing',
  'published',
  'failed',
] as const
export type FacebookPostStatus = (typeof FACEBOOK_POST_STATUSES)[number]

export type FacebookPostType = 'feed' | 'reel'

/** 1 ảnh đính kèm (đã upload). */
export const facebookPostImageSchema = z.object({
  imagePath: z.string(),
  imageUrl: z.string(),
})
export type FacebookPostImage = z.infer<typeof facebookPostImageSchema>

/** Bài đăng trả về từ backend. */
export const facebookPostSchema = z.object({
  id: z.string(),
  facebookAccountId: z.string(),
  fbUserId: z.string().optional().default(''),
  pageId: z.string(),
  pageName: z.string().optional().default(''),
  postType: z.enum(['feed', 'reel']),
  message: z.string().optional().default(''),
  firstComment: z.string().optional().default(''),
  images: z.array(facebookPostImageSchema).optional().default([]),
  videoPath: z.string().optional().default(''),
  videoUrl: z.string().optional().default(''),
  status: z.enum(FACEBOOK_POST_STATUSES),
  scheduledAt: z.string().nullable().optional(),
  timezone: z.string().optional().default('Asia/Ho_Chi_Minh'),
  postId: z.string().optional().default(''),
  permalinkUrl: z.string().optional().default(''),
  errorMessage: z.string().optional().default(''),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type FacebookPost = z.infer<typeof facebookPostSchema>

/** Tham số lọc/phân trang (khớp query backend). */
export interface FacebookPostListParams {
  page: number
  limit: number
  search?: string
  status?: FacebookPostStatus | 'all'
  facebookAccountId?: string
  pageId?: string
}

/** Response danh sách phân trang (`data` của envelope). */
export interface PaginatedFacebookPosts {
  items: FacebookPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Payload tạo bài. `publishNow` và `scheduledAt` loại trừ nhau. */
export interface CreateFacebookPostPayload {
  facebookAccountId: string
  pageId: string
  pageName?: string
  postType: FacebookPostType
  message?: string
  firstComment?: string
  images?: FacebookPostImage[]
  videoPath?: string
  videoUrl?: string
  publishNow?: boolean
  scheduledAt?: string
  timezone?: string
}

/** Payload cập nhật bài (gửi scheduledAt=null để huỷ lịch). */
export interface UpdateFacebookPostPayload {
  pageId?: string
  pageName?: string
  postType?: FacebookPostType
  message?: string
  firstComment?: string
  images?: FacebookPostImage[]
  videoPath?: string
  videoUrl?: string
  scheduledAt?: string | null
  timezone?: string
}
