/**
 * API client mỏng dựa trên `fetch` (không phụ thuộc axios để giữ bundle nhẹ).
 * - Tự động prepend `VITE_API_BASE_URL`.
 * - Tự serialize/deserialize JSON.
 * - Gắn `Authorization: Bearer <accessToken>` (token giữ trong RAM).
 * - `credentials: 'include'` để gửi httpOnly refresh cookie kèm request.
 * - Tự refresh & retry MỘT lần khi gặp 401 (single-flight, do tầng auth đăng ký).
 * - Ném `ApiError` có cấu trúc để tầng UI / React Query xử lý nhất quán.
 */

import { getAccessToken } from '@/lib/auth-token'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Handler refresh token do tầng `features/auth` đăng ký (tránh circular import:
 * lib không được phụ thuộc feature). Trả về `true` nếu refresh thành công.
 */
type RefreshHandler = () => Promise<boolean>
let refreshHandler: RefreshHandler | null = null
export const setRefreshHandler = (fn: RefreshHandler | null): void => {
  refreshHandler = fn
}

export class ApiError extends Error {
  public readonly status: number
  public readonly data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  /** Body sẽ được JSON.stringify tự động (nếu là object). */
  body?: unknown
  /** Query params dạng key-value, tự bỏ qua giá trị undefined/null. */
  params?: Record<string, string | number | boolean | undefined | null>
  /** Bỏ qua cơ chế tự refresh khi 401 (dùng cho chính endpoint auth/login/refresh). */
  skipAuthRefresh?: boolean
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(
    path.startsWith('http') ? path : `${BASE_URL}${path}`,
    // base dùng cho trường hợp BASE_URL rỗng (relative path khi dev với proxy)
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
  )

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

async function request<TResponse>(
  method: string,
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<TResponse> {
  const { body, params, headers, skipAuthRefresh, ...rest } = options
  const token = getAccessToken()

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Gắn Bearer token (nếu có) cho mọi request đã xác thực.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Gửi cookie (httpOnly refresh token) kèm request — bắt buộc cho luồng refresh.
    credentials: 'include',
    ...rest,
  })

  // 401 -> thử refresh access token MỘT lần rồi gọi lại request gốc.
  if (
    response.status === 401 &&
    !isRetry &&
    !skipAuthRefresh &&
    refreshHandler !== null
  ) {
    const refreshed = await refreshHandler()
    if (refreshed) {
      return request<TResponse>(method, path, options, true)
    }
  }

  // Một số endpoint trả 204 No Content
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText) || 'Đã có lỗi xảy ra'
    throw new ApiError(message, response.status, payload)
  }

  return payload as TResponse
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>('PATCH', path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
