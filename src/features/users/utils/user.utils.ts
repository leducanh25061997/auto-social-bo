import { format, parseISO } from 'date-fns'

import type { BadgeProps } from '@/components/ui/badge'
import type { UserRole } from '@/features/users/types/user.types'

/** Nhãn tiếng Việt cho vai trò. */
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Quản trị viên',
  USER: 'Người dùng',
}

/** Variant Badge theo vai trò. */
export const ROLE_BADGE_VARIANT: Record<UserRole, BadgeProps['variant']> = {
  ADMIN: 'default',
  USER: 'secondary',
}

/** Định dạng ISO -> dd/MM/yyyy. Trả về '—' nếu thiếu/sai. */
export const formatDate = (iso?: string): string => {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'dd/MM/yyyy')
  } catch {
    return '—'
  }
}
