import { apiClient } from '@/lib/api-client'
import {
  facebookAccountSchema,
  facebookPageSchema,
  type ConnectFacebookPayload,
  type ExchangeFacebookPayload,
  type FacebookAccount,
  type FacebookAccountListParams,
  type FacebookConnectPreview,
  type FacebookPage,
  type PaginatedFacebookAccounts,
} from '@/features/facebook-accounts/types/facebook-account.types'

/** Envelope chuẩn của backend cho response thành công. */
interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

/** GET /facebook-accounts — danh sách phân trang + lọc. */
export const getFacebookAccounts = async (
  params: FacebookAccountListParams,
): Promise<PaginatedFacebookAccounts> => {
  const res = await apiClient.get<ApiEnvelope<PaginatedFacebookAccounts>>(
    '/facebook-accounts',
    {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        status: params.status && params.status !== 'all' ? params.status : undefined,
      },
    },
  )
  // Validate từng item để fail-fast khi schema lệch backend.
  return { ...res.data, items: res.data.items.map((a) => facebookAccountSchema.parse(a)) }
}

/** POST /facebook-accounts/exchange — bước 1: đổi code lấy hồ sơ xem trước. */
export const exchangeFacebookAccount = async (
  payload: ExchangeFacebookPayload,
): Promise<FacebookConnectPreview> => {
  const res = await apiClient.post<ApiEnvelope<{ preview: FacebookConnectPreview }>>(
    '/facebook-accounts/exchange',
    { body: payload },
  )
  return res.data.preview
}

/** POST /facebook-accounts/connect — bước 2: xác nhận tạo tài khoản. */
export const connectFacebookAccount = async (
  payload: ConnectFacebookPayload,
): Promise<FacebookAccount> => {
  const res = await apiClient.post<ApiEnvelope<{ account: FacebookAccount }>>(
    '/facebook-accounts/connect',
    { body: payload },
  )
  return facebookAccountSchema.parse(res.data.account)
}

/** PATCH /facebook-accounts/:id — đổi tên và/hoặc bật-tắt. */
export const updateFacebookAccount = async (
  id: string,
  payload: { name?: string; isActive?: boolean },
): Promise<FacebookAccount> => {
  const res = await apiClient.patch<ApiEnvelope<{ account: FacebookAccount }>>(
    `/facebook-accounts/${id}`,
    { body: payload },
  )
  return facebookAccountSchema.parse(res.data.account)
}

/** DELETE /facebook-accounts/:id — xoá tài khoản. */
export const deleteFacebookAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/facebook-accounts/${id}`)
}

/** POST /facebook-accounts/:id/refresh — gia hạn token thủ công. */
export const refreshFacebookAccount = async (id: string): Promise<FacebookAccount> => {
  const res = await apiClient.post<ApiEnvelope<{ account: FacebookAccount }>>(
    `/facebook-accounts/${id}/refresh`,
  )
  return facebookAccountSchema.parse(res.data.account)
}

/** GET /facebook-accounts/:id/pages — danh sách Page tài khoản quản trị. */
export const getFacebookPages = async (id: string): Promise<FacebookPage[]> => {
  const res = await apiClient.get<ApiEnvelope<{ pages: FacebookPage[] }>>(
    `/facebook-accounts/${id}/pages`,
  )
  return res.data.pages.map((p) => facebookPageSchema.parse(p))
}
