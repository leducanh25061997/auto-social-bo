import { memo } from 'react'

import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/features/users/types/user.types'
import { ROLE_BADGE_VARIANT, ROLE_LABELS } from '@/features/users/utils/user.utils'

/** Badge hiển thị vai trò người dùng. */
export const RoleBadge = memo(function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant={ROLE_BADGE_VARIANT[role]}>{ROLE_LABELS[role]}</Badge>
})
