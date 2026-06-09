import { refreshRequest } from '@/features/auth/api/auth.api'
import { refreshTokenStore } from '@/features/auth/api/refresh-token-store'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Single-flight refresh: nhiều request 401 cùng lúc chỉ kích hoạt MỘT lời gọi
 * refresh, tất cả cùng chờ chung kết quả (tránh "refresh storm").
 */
let pending: Promise<boolean> | null = null

const doRefresh = async (): Promise<boolean> => {
  try {
    const { user, accessToken } = await refreshRequest()
    useAuthStore.getState().setSession(user, accessToken)
    return true
  } catch {
    // Refresh thất bại -> coi như hết phiên: dọn store + xoá refresh token hỏng.
    useAuthStore.getState().clearSession()
    refreshTokenStore.clear()
    return false
  }
}

/** Làm mới access token (an toàn khi gọi đồng thời). */
export const refreshSession = (): Promise<boolean> => {
  if (!pending) {
    pending = doRefresh().finally(() => {
      pending = null
    })
  }
  return pending
}
