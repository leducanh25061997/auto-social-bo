import type { ReactNode } from 'react'

import { PageLoader } from '@/components/common/page-loader'
import { useAuthBootstrap } from '@/features/auth/hooks/use-auth-bootstrap'

/**
 * Bao toàn bộ app: chạy "silent refresh" lúc khởi động và CHẶN render cho tới khi
 * biết được trạng thái phiên (idle -> authenticated/unauthenticated). Nhờ đó các
 * route guard không bị nháy (flash) sai trạng thái khi tải lại trang.
 */
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const status = useAuthBootstrap()

  if (status === 'idle') {
    return (
      <div className="flex h-screen items-center justify-center">
        <PageLoader />
      </div>
    )
  }

  return <>{children}</>
}
