import { memo } from 'react'

import { Badge } from '@/components/ui/badge'
import type { PostStatus } from '@/features/posts/types/post.types'
import { STATUS_BADGE_VARIANT, STATUS_LABELS } from '@/features/posts/utils/post.utils'

interface PostStatusBadgeProps {
  status: PostStatus
}

/** Badge hiển thị trạng thái bài đăng — thuần presentational nên dùng memo. */
export const PostStatusBadge = memo(function PostStatusBadge({
  status,
}: PostStatusBadgeProps) {
  return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
})
