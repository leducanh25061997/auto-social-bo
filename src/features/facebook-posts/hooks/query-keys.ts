import type { FacebookPostListParams } from '@/features/facebook-posts/types/facebook-post.types'

/** Query key factory — tập trung hoá để invalidate nhất quán. */
export const facebookPostKeys = {
  all: ['facebook-posts'] as const,
  lists: () => [...facebookPostKeys.all, 'list'] as const,
  list: (params: FacebookPostListParams) => [...facebookPostKeys.lists(), params] as const,
  details: () => [...facebookPostKeys.all, 'detail'] as const,
  detail: (id: string) => [...facebookPostKeys.details(), id] as const,
}
