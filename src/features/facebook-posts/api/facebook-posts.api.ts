import { apiClient, ApiError } from '@/lib/api-client'
import { getAccessToken } from '@/lib/auth-token'
import {
  facebookPostImageSchema,
  facebookPostSchema,
  type CreateFacebookPostPayload,
  type FacebookPost,
  type FacebookPostImage,
  type FacebookPostListParams,
  type PaginatedFacebookPosts,
  type UpdateFacebookPostPayload,
} from '@/features/facebook-posts/types/facebook-post.types'

/** Envelope chuẩn của backend cho response thành công. */
interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/** GET /facebook-posts — danh sách phân trang + lọc. */
export const getFacebookPosts = async (
  params: FacebookPostListParams,
): Promise<PaginatedFacebookPosts> => {
  const res = await apiClient.get<ApiEnvelope<PaginatedFacebookPosts>>('/facebook-posts', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status && params.status !== 'all' ? params.status : undefined,
      facebookAccountId: params.facebookAccountId || undefined,
      pageId: params.pageId || undefined,
    },
  })
  return { ...res.data, items: res.data.items.map((p) => facebookPostSchema.parse(p)) }
}

/** GET /facebook-posts/:id — chi tiết 1 bài. */
export const getFacebookPost = async (id: string): Promise<FacebookPost> => {
  const res = await apiClient.get<ApiEnvelope<{ post: FacebookPost }>>(`/facebook-posts/${id}`)
  return facebookPostSchema.parse(res.data.post)
}

/** POST /facebook-posts — tạo (nháp / lên lịch / đăng ngay). */
export const createFacebookPost = async (
  payload: CreateFacebookPostPayload,
): Promise<FacebookPost> => {
  const res = await apiClient.post<ApiEnvelope<{ post: FacebookPost }>>('/facebook-posts', {
    body: payload,
  })
  return facebookPostSchema.parse(res.data.post)
}

/** PATCH /facebook-posts/:id — cập nhật bài nháp/đã lên lịch/lỗi. */
export const updateFacebookPost = async (
  id: string,
  payload: UpdateFacebookPostPayload,
): Promise<FacebookPost> => {
  const res = await apiClient.patch<ApiEnvelope<{ post: FacebookPost }>>(
    `/facebook-posts/${id}`,
    { body: payload },
  )
  return facebookPostSchema.parse(res.data.post)
}

/** POST /facebook-posts/generate-comment — AI gợi ý comment đầu tiên theo nội dung bài. */
export const generateFacebookPostComment = async (payload: {
  message: string
  pageName?: string
}): Promise<string> => {
  const res = await apiClient.post<ApiEnvelope<{ comment: string }>>(
    '/facebook-posts/generate-comment',
    { body: payload },
  )
  return res.data.comment
}

/** POST /facebook-posts/:id/publish — đăng ngay. */
export const publishFacebookPost = async (id: string): Promise<FacebookPost> => {
  const res = await apiClient.post<ApiEnvelope<{ post: FacebookPost }>>(
    `/facebook-posts/${id}/publish`,
  )
  return facebookPostSchema.parse(res.data.post)
}

/** POST /facebook-posts/:id/reschedule — đổi lịch. */
export const rescheduleFacebookPost = async (
  id: string,
  scheduledAt: string,
): Promise<FacebookPost> => {
  const res = await apiClient.post<ApiEnvelope<{ post: FacebookPost }>>(
    `/facebook-posts/${id}/reschedule`,
    { body: { scheduledAt } },
  )
  return facebookPostSchema.parse(res.data.post)
}

/** POST /facebook-posts/:id/cancel-schedule — huỷ lịch (về nháp). */
export const cancelScheduleFacebookPost = async (id: string): Promise<FacebookPost> => {
  const res = await apiClient.post<ApiEnvelope<{ post: FacebookPost }>>(
    `/facebook-posts/${id}/cancel-schedule`,
  )
  return facebookPostSchema.parse(res.data.post)
}

/** DELETE /facebook-posts/:id — xoá (tuỳ chọn xoá luôn trên Facebook). */
export const deleteFacebookPost = async (
  id: string,
  deleteOnFacebook = false,
): Promise<void> => {
  await apiClient.delete(`/facebook-posts/${id}`, { body: { deleteOnFacebook } })
}

// ── Upload (multipart) ────────────────────────────────────────────────────────
//
// apiClient chỉ gửi JSON; upload cần multipart/form-data nên dùng fetch trực tiếp,
// tự gắn Bearer token + gỡ envelope. KHÔNG set Content-Type (để browser tự thêm
// boundary).

const uploadRequest = async <T>(path: string, form: FormData): Promise<T> => {
  const token = getAccessToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
    credentials: 'include',
  })
  const payload = (await res.json().catch(() => null)) as
    | (ApiEnvelope<T> & { message?: string })
    | null
  if (!res.ok) {
    const message =
      (payload && 'message' in payload && payload.message) || 'Tải tệp lên thất bại'
    throw new ApiError(String(message), res.status, payload)
  }
  return (payload as ApiEnvelope<T>).data
}

/** POST /facebook-posts/upload-images — tải nhiều ảnh, trả về path + url. */
export const uploadFacebookPostImages = async (
  files: File[],
): Promise<FacebookPostImage[]> => {
  const form = new FormData()
  files.forEach((f) => form.append('images', f))
  const data = await uploadRequest<{ images: FacebookPostImage[] }>(
    '/facebook-posts/upload-images',
    form,
  )
  return data.images.map((i) => facebookPostImageSchema.parse(i))
}

/** POST /facebook-posts/upload-video — tải 1 video. */
export const uploadFacebookPostVideo = async (
  file: File,
): Promise<{ videoPath: string; videoUrl: string }> => {
  const form = new FormData()
  form.append('video', file)
  return uploadRequest<{ videoPath: string; videoUrl: string }>(
    '/facebook-posts/upload-video',
    form,
  )
}
