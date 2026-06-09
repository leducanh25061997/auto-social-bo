/**
 * Lưu REFRESH TOKEN ở web storage.
 *
 * Vì sao: backend `auto-social-api` trả refresh token trong BODY của response
 * (không đặt httpOnly cookie). Do đó frontend buộc phải tự giữ token này để
 * thực hiện silent refresh sau khi reload.
 *
 * Đánh đổi bảo mật: web storage có thể bị đọc qua XSS (kém an toàn hơn httpOnly
 * cookie). Đây là giới hạn do thiết kế API hiện tại. Nếu sau này backend chuyển
 * sang đặt cookie, hãy XOÁ module này và bỏ field refreshToken khỏi luồng.
 *
 * - rememberMe = true  -> localStorage (sống qua việc đóng trình duyệt)
 * - rememberMe = false -> sessionStorage (mất khi đóng tab)
 */
const STORAGE_KEY = 'auto_social_refresh_token'

export interface StoredRefreshToken {
  token: string
  /** true nếu đang nằm trong localStorage (rememberMe) — để rotation giữ nguyên vòng đời. */
  persistent: boolean
}

export const refreshTokenStore = {
  /** Lưu token; xoá vị trí cũ trước để tránh tồn tại đồng thời ở 2 storage. */
  set(token: string, persistent: boolean): void {
    this.clear()
    const store = persistent ? window.localStorage : window.sessionStorage
    store.setItem(STORAGE_KEY, token)
  },

  get(): StoredRefreshToken | null {
    const fromLocal = window.localStorage.getItem(STORAGE_KEY)
    if (fromLocal) return { token: fromLocal, persistent: true }

    const fromSession = window.sessionStorage.getItem(STORAGE_KEY)
    if (fromSession) return { token: fromSession, persistent: false }

    return null
  },

  clear(): void {
    window.localStorage.removeItem(STORAGE_KEY)
    window.sessionStorage.removeItem(STORAGE_KEY)
  },
}
