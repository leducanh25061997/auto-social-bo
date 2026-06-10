import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  getFacebookPost,
  getFacebookPosts,
} from '@/features/facebook-posts/api/facebook-posts.api'
import { facebookPostKeys } from '@/features/facebook-posts/hooks/query-keys'
import type { FacebookPostListParams } from '@/features/facebook-posts/types/facebook-post.types'

/** Danh sách bài đăng (phân trang server-side). */
export const useFacebookPosts = (params: FacebookPostListParams) =>
  useQuery({
    queryKey: facebookPostKeys.list(params),
    queryFn: () => getFacebookPosts(params),
    placeholderData: keepPreviousData,
  })

/** Chi tiết 1 bài (dùng cho trang sửa). Chỉ chạy khi có id. */
export const useFacebookPost = (id: string | undefined) =>
  useQuery({
    queryKey: facebookPostKeys.detail(id ?? ''),
    queryFn: () => getFacebookPost(id as string),
    enabled: Boolean(id),
  })
