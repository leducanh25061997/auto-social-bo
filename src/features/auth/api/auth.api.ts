import { ApiError, apiClient } from '@/lib/api-client'
import { setAccessToken } from '@/lib/auth-token'
import { refreshTokenStore } from '@/features/auth/api/refresh-token-store'
import {
  userSchema,
  type AuthResponse,
  type LoginPayload,
  type User,
} from '@/features/auth/types/auth.types'

/*
 * ────────────────────────────────────────────────────────────────────────────
 * AUTH API — nối với backend `auto-social-api` (Express, base path `/api/v1`).
 * ────────────────────────────────────────────────────────────────────────────
 * Backend bọc mọi response trong { status, data } và trả refreshToken trong body
 * (không dùng httpOnly cookie). Tầng này:
 *   - Gỡ lớp envelope `data`.
 *   - Validate `user` bằng zod (userSchema) để fail-fast khi schema lệch.
 *   - Quản lý refresh token qua `refreshTokenStore` (web storage).
 * Endpoint:
 *   login   POST /auth/login    body { username, password }    -> { user, accessToken, refreshToken }
 *   refresh POST /auth/refresh  body { refreshToken }          -> { accessToken, refreshToken }
 *   logout  POST /auth/logout   body { refreshToken }          -> { message }
 *   me      GET  /auth/me       (Bearer)                       -> { user }
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Lớp envelope chuẩn của backend cho response thành công. */
interface ApiEnvelope<T> {
  status: string
  data: T
  message?: string
}

interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}

interface TokenData {
  accessToken: string
  refreshToken: string
}

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { username, password, rememberMe } = payload

  // skipAuthRefresh: chính endpoint auth — không kích hoạt vòng lặp refresh khi 401.
  const res = await apiClient.post<ApiEnvelope<AuthData>>('/auth/login', {
    body: { username, password },
    skipAuthRefresh: true,
  })

  const { user, accessToken, refreshToken } = res.data
  refreshTokenStore.set(refreshToken, Boolean(rememberMe))

  return { user: userSchema.parse(user), accessToken }
}

export const refreshRequest = async (): Promise<AuthResponse> => {
  const stored = refreshTokenStore.get()
  if (!stored) {
    throw new ApiError('Phiên đăng nhập đã hết hạn', 401, null)
  }

  // Backend rotation: cấp cặp token mới, thu hồi token cũ.
  const res = await apiClient.post<ApiEnvelope<TokenData>>('/auth/refresh', {
    body: { refreshToken: stored.token },
    skipAuthRefresh: true,
  })

  const { accessToken, refreshToken } = res.data
  refreshTokenStore.set(refreshToken, stored.persistent)

  // /auth/refresh không trả user -> cần access token trong RAM để gọi /auth/me.
  setAccessToken(accessToken)
  const me = await apiClient.get<ApiEnvelope<{ user: User }>>('/auth/me', {
    skipAuthRefresh: true,
  })

  return { user: userSchema.parse(me.data.user), accessToken }
}

export const logoutRequest = async (): Promise<void> => {
  const stored = refreshTokenStore.get()
  try {
    if (stored) {
      // Backend thu hồi refresh token này (idempotent).
      await apiClient.post('/auth/logout', {
        body: { refreshToken: stored.token },
        skipAuthRefresh: true,
      })
    }
  } finally {
    // Dù backend lỗi vẫn dọn token phía client.
    refreshTokenStore.clear()
  }
}
