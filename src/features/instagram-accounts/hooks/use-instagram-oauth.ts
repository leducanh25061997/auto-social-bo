import { useCallback } from 'react'

import {
  INSTAGRAM_APP_ID,
  INSTAGRAM_SCOPES,
  getInstagramRedirectUri,
  isInstagramConfigured,
} from '@/features/instagram-accounts/config'
import type { ExchangeInstagramPayload } from '@/features/instagram-accounts/types/instagram-account.types'

/** Dữ liệu trang callback gửi về cửa sổ cha qua postMessage. */
interface OAuthMessage {
  type: 'instagram-oauth'
  code?: string
  error?: string
  state?: string
}

/** Lỗi "người dùng huỷ" — để tầng trên thông báo nhẹ thay vì báo đỏ. */
export class InstagramOAuthCancelled extends Error {
  constructor(message = 'Đã huỷ kết nối Instagram') {
    super(message)
    this.name = 'InstagramOAuthCancelled'
  }
}

/**
 * Mở pop-up đăng nhập Instagram và chờ `code` trả về từ trang callback.
 * Resolve `{ code, redirectUri }` để gửi lên backend đổi lấy token.
 */
const openInstagramLogin = (): Promise<ExchangeInstagramPayload> =>
  new Promise((resolve, reject) => {
    const redirectUri = getInstagramRedirectUri()
    const state =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now())

    const authUrl =
      `https://www.instagram.com/oauth/authorize` +
      `?client_id=${encodeURIComponent(INSTAGRAM_APP_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}` +
      `&scope=${encodeURIComponent(INSTAGRAM_SCOPES)}` +
      `&response_type=code`

    const width = 600
    const height = 720
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(
      authUrl,
      'instagram-oauth',
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
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data || data.type !== 'instagram-oauth') return

      cleanup()
      try {
        popup.close()
      } catch {
        /* bỏ qua */
      }

      if (data.error || !data.code) {
        reject(new InstagramOAuthCancelled('Bạn đã huỷ hoặc Instagram từ chối đăng nhập.'))
      } else if (data.state !== state) {
        reject(new Error('Phiên đăng nhập không hợp lệ, vui lòng thử lại.'))
      } else {
        resolve({ code: data.code, redirectUri })
      }
    }

    window.addEventListener('message', onMessage)

    const timer = window.setInterval(() => {
      if (popup.closed && !settled) {
        cleanup()
        reject(new InstagramOAuthCancelled('Cửa sổ đăng nhập đã đóng.'))
      }
    }, 500)
  })

/** Hook tiện dụng: trả hàm mở đăng nhập + cờ đã cấu hình. */
export const useInstagramOAuth = () => {
  const login = useCallback(() => openInstagramLogin(), [])
  return { login, isConfigured: isInstagramConfigured }
}
