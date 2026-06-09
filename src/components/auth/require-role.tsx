import { Outlet } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks/use-auth'
import type { UserRole } from '@/features/auth/types/auth.types'

interface RequireRoleProps {
  roles: UserRole[]
}

/**
 * Cổng phân quyền theo vai trò (RBAC), dùng SAU RequireAuth.
 * Người đã đăng nhập nhưng không đủ quyền sẽ thấy thông báo 403 (không redirect
 * ngầm để họ hiểu vì sao bị chặn). Backend vẫn là tầng chặn cuối cùng.
 */
export const RequireRole = ({ roles }: RequireRoleProps) => {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <ShieldAlert className="size-12 text-destructive" />
        <h1 className="text-xl font-semibold">Không có quyền truy cập</h1>
        <p className="text-sm text-muted-foreground">
          Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    )
  }

  return <Outlet />
}
