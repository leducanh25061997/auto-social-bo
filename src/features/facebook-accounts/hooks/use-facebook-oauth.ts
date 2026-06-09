import { useCallback } from 'react'

import {
  FACEBOOK_APP_ID,
  FACEBOOK_GRAPH_VERSION,
  FACEBOOK_SCOPES,
  getFacebookRedirectUri,
  isFacebookConfigured,
} from '@/features/facebook-accounts/config'
import type { ExchangeFacebookPayload } from '@/features/facebook-accounts/types/facebook-account.types'

/** Dữ liệu trang callback gửi về cửa sổ cha qua postMessage. */
interface OAuthMessage {
  type: 'facebook-oauth'
  code?: string
  error?: string
  state?: string
}

/** Lỗi "người dùng huỷ" — để tầng trên im lặng/nhẹ nhàng thay vì báo đỏ. */
export class FacebookOAuthCancelled extends Error {
  constructor(message = 'Đã huỷ kết nối Facebook') {
    super(message)
    this.name = 'FacebookOAuthCancelled'
  }
}

/**
 * Mở pop-up đăng nhập Facebook và chờ `code` trả về từ trang callback.
 * Resolve `{ code, redirectUri }` để gửi lên backend đổi lấy token (token KHÔNG
 * đi qua client). Mọi lỗi đều có thông báo tiếng Việt dễ hiểu.
 */
const openFacebookLogin = (): Promise<ExchangeFacebookPayload> =>
  new Promise((resolve, reject) => {
    const redirectUri = getFacebookRedirectUri()
    // crypto.randomUUID có sẵn trên mọi trình duyệt hiện đại + localhost https/http.
    const state =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now())

    const authUrl =
      `https://www.facebook.com/${FACEBOOK_GRAPH_VERSION}/dialog/oauth` +
      `?client_id=${encodeURIComponent(FACEBOOK_APP_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}` +
      `&scope=${encodeURIComponent(FACEBOOK_SCOPES)}` +
      `&response_type=code`

    const width = 600
    const height = 720
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(
      authUrl,
      'facebook-oauth',
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    if (!popup) {
      reject(
        new Error(
          'Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép pop-up rồi thử lại.',
        ),
      )
      return
    }

    let settled = false
    const cleanup = () => {
      settled = true
      window.removeEventListener('message', onMessage)
      clearInterval(timer)
    }

    const onMessage = (event: MessageEvent<OAuthMessage>) => {
      // Chỉ nhận thông điệp từ chính ứng dụng (cùng origin).
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data || data.type !== 'facebook-oauth') return

      cleanup()
      try {
        popup.close()
      } catch {
        /* bỏ qua */
      }

      if (data.error || !data.code) {
        reject(new FacebookOAuthCancelled('Bạn đã huỷ hoặc Facebook từ chối đăng nhập.'))
      } else if (data.state !== state) {
        reject(new Error('Phiên đăng nhập không hợp lệ, vui lòng thử lại.'))
      } else {
        resolve({ code: data.code, redirectUri })
      }
    }

    window.addEventListener('message', onMessage)

    // Người dùng tự đóng pop-up giữa chừng -> coi như huỷ.
    const timer = window.setInterval(() => {
      if (popup.closed && !settled) {
        cleanup()
        reject(new FacebookOAuthCancelled('Cửa sổ đăng nhập đã đóng.'))
      }
    }, 500)
  })

/** Hook tiện dụng: trả hàm mở đăng nhập + cờ đã cấu hình. */
export const useFacebookOAuth = () => {
  const login = useCallback(() => openFacebookLogin(), [])
  return { login, isConfigured: isFacebookConfigured }
}
