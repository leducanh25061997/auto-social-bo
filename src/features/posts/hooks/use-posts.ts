import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getPosts } from '@/features/posts/api/posts.api'
import { postKeys } from '@/features/posts/hooks/query-keys'
import type { PostListParams } from '@/features/posts/types/post.types'

/**
 * Lấy danh sách bài đăng có lọc.
 * - `keepPreviousData`: giữ dữ liệu cũ khi đổi filter để UI không nhấp nháy.
 */
export const useGetPosts = (params: PostListParams) =>
  useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPosts(params),
    placeholderData: keepPreviousData,
  })
