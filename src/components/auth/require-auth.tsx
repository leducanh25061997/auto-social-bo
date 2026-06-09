import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { PageLoader } from '@/components/common/page-loader'
import { useAuth } from '@/features/auth/hooks/use-auth'

/**
 * Cổng bảo vệ các route cần đăng nhập.
 * - `idle`            -> đang khôi phục phiên: hiện loader (không nháy về login).
 * - `unauthenticated` -> chuyển tới /login, ghi nhớ trang đang muốn vào (deep-link).
 * - `authenticated`   -> render route con qua <Outlet/>.
 */
export const RequireAuth = () => {
  const location = useLocation()
  const { status } = useAuth()

  if (status === 'idle') {
    return (
      <div className="flex h-screen items-center justify-center">
        <PageLoader />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    // `state.from` để sau khi đăng nhập quay lại đúng trang.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
