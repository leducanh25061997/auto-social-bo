import { toast } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/lib/api-error'

/**
 * Hệ thống thông báo DÙNG CHUNG cho toàn app — luôn dùng `notify.*` thay vì gọi
 * `toast()` trực tiếp, để màu sắc + icon đồng nhất theo loại.
 *
 * - success (xanh lá) · error (đỏ) · warning (vàng) · info (xanh dương)
 * - `notify.apiError(error)` tự gỡ chi tiết lỗi validation từ backend cho rõ nghĩa.
 */
export const notify = {
  success: (title: string, description?: string) =>
    toast({ variant: 'success', title, description }),

  error: (title: string, description?: string) =>
    toast({ variant: 'destructive', title, description }),

  warning: (title: string, description?: string) =>
    toast({ variant: 'warning', title, description }),

  info: (title: string, description?: string) =>
    toast({ variant: 'info', title, description }),

  /** Toast lỗi từ một lỗi API — title cố định, mô tả là thông báo rõ nghĩa. */
  apiError: (error: unknown, title = 'Thao tác thất bại') =>
    toast({ variant: 'destructive', title, description: getApiErrorMessage(error) }),
}
