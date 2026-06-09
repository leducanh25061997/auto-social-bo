import { apiClient } from '@/lib/api-client'
import {
  instagramAccountSchema,
  type ConnectInstagramPayload,
  type ExchangeInstagramPayload,
  type InstagramAccount,
  type InstagramAccountListParams,
  type InstagramConnectPreview,
  type PaginatedInstagramAccounts,
} from '@/features/instagram-accounts/types/instagram-account.types'

interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

/** GET /instagram-accounts — danh sách phân trang + lọc. */
export const getInstagramAccounts = async (
  params: InstagramAccountListParams,
): Promise<PaginatedInstagramAccounts> => {
  const res = await apiClient.get<ApiEnvelope<PaginatedInstagramAccounts>>(
    '/instagram-accounts',
    {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        status: params.status && params.status !== 'all' ? params.status : undefined,
      },
    },
  )
  return { ...res.data, items: res.data.items.map((a) => instagramAccountSchema.parse(a)) }
}

/** POST /instagram-accounts/exchange — bước 1: đổi code lấy hồ sơ xem trước. */
export const exchangeInstagramAccount = async (
  payload: ExchangeInstagramPayload,
): Promise<InstagramConnectPreview> => {
  const res = await apiClient.post<ApiEnvelope<{ preview: InstagramConnectPreview }>>(
    '/instagram-accounts/exchange',
    { body: payload },
  )
  return res.data.preview
}

/** POST /instagram-accounts/connect — bước 2: xác nhận tạo tài khoản. */
export const connectInstagramAccount = async (
  payload: ConnectInstagramPayload,
): Promise<InstagramAccount> => {
  const res = await apiClient.post<ApiEnvelope<{ account: InstagramAccount }>>(
    '/instagram-accounts/connect',
    { body: payload },
  )
  return instagramAccountSchema.parse(res.data.account)
}

/** PATCH /instagram-accounts/:id — đổi tên và/hoặc bật-tắt. */
export const updateInstagramAccount = async (
  id: string,
  payload: { name?: string; isActive?: boolean },
): Promise<InstagramAccount> => {
  const res = await apiClient.patch<ApiEnvelope<{ account: InstagramAccount }>>(
    `/instagram-accounts/${id}`,
    { body: payload },
  )
  return instagramAccountSchema.parse(res.data.account)
}

/** DELETE /instagram-accounts/:id — xoá tài khoản. */
export const deleteInstagramAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/instagram-accounts/${id}`)
}

/** POST /instagram-accounts/:id/refresh — gia hạn token thủ công. */
export const refreshInstagramAccount = async (id: string): Promise<InstagramAccount> => {
  const res = await apiClient.post<ApiEnvelope<{ account: InstagramAccount }>>(
    `/instagram-accounts/${id}/refresh`,
  )
  return instagramAccountSchema.parse(res.data.account)
}
