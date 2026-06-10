import { Badge } from '@/components/ui/badge'
import { POST_STATUS_META } from '@/features/facebook-posts/utils/post.utils'
import type { FacebookPostStatus } from '@/features/facebook-posts/types/facebook-post.types'

/** Badge trạng thái bài đăng (màu theo POST_STATUS_META). */
export const FacebookPostStatusBadge = ({ status }: { status: FacebookPostStatus }) => {
  const meta = POST_STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
