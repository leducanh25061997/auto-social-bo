import { useAuthStore } from '@/stores/auth-store'
import type { UserRole } from '@/features/auth/types/auth.types'

/**
 * Selector tiện dụng cho trạng thái xác thực.
 * Dùng selector tách lẻ để component chỉ re-render khi đúng phần nó quan tâm.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    /** Kiểm tra vai trò — phục vụ ẩn/hiện UI theo quyền (RBAC phía client). */
    hasRole: (role: UserRole) => user?.role === role,
  }
}
