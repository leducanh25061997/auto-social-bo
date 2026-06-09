import type { PostListParams } from '@/features/posts/types/post.types'

/**
 * Query key factory — tập trung hoá key để invalidate nhất quán, tránh gõ tay
 * chuỗi rải rác khắp nơi (nguồn lỗi cache phổ biến).
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostListParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}
