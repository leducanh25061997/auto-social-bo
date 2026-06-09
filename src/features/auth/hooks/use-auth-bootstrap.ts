import { useEffect } from 'react'

import { setRefreshHandler } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import { refreshSession } from '@/features/auth/api/session'

/**
 * Khởi tạo phiên khi app mount ("silent refresh"):
 * - Đăng ký handler refresh cho api-client (để tự refresh khi gặp 401).
 * - Thử khôi phục phiên từ refresh token đã lưu (web storage). Thành công ->
 *   authenticated; thất bại -> unauthenticated. Trong lúc chờ, status = 'idle'.
 *
 * Trả về `status` để tầng gốc quyết định render loader hay app.
 */
export const useAuthBootstrap = () => {
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    setRefreshHandler(refreshSession)
    // refreshSession tự cập nhật store (setSession / clearSession) theo kết quả.
    void refreshSession()

    return () => setRefreshHandler(null)
  }, [])

  return status
}
