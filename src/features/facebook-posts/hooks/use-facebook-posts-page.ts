import { useCallback, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { DEFAULT_PAGE_SIZE } from '@/components/common/data-table'
import { isFacebookConfigured } from '@/features/facebook-accounts/config'
import { useGetFacebookAccounts } from '@/features/facebook-accounts/hooks/use-facebook-accounts'
import { useFacebookPosts } from '@/features/facebook-posts/hooks/use-facebook-posts'
import { useFacebookPostMutations } from '@/features/facebook-posts/hooks/use-facebook-post-mutations'
import type {
  FacebookPost,
  FacebookPostListParams,
  FacebookPostStatus,
} from '@/features/facebook-posts/types/facebook-post.types'

type StatusFilter = FacebookPostStatus | 'all'

/** Điều phối toàn bộ logic trang danh sách bài đăng (tách khỏi View). */
export const useFacebookPostsPage = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [accountId, setAccountId] = useState<string>('')

  const debouncedSearch = useDebouncedValue(search, 300)

  const params = useMemo<FacebookPostListParams>(
    () => ({ page, limit, search: debouncedSearch, status, facebookAccountId: accountId }),
    [page, limit, debouncedSearch, status, accountId],
  )

  const { data, isLoading, isError, refetch } = useFacebookPosts(params)

  // Danh sách tài khoản để lọc (lấy hết, cả đang hoạt động lẫn tạm dừng).
  const { data: accountsData } = useGetFacebookAccounts({ page: 1, status: 'all' })
  const accounts = accountsData?.items ?? []

  const { publishMutation, rescheduleMutation, cancelScheduleMutation, deleteMutation } =
    useFacebookPostMutations()

  // Dialog state.
  const [deletingPost, setDeletingPost] = useState<FacebookPost | null>(null)
  const [reschedulingPost, setReschedulingPost] = useState<FacebookPost | null>(null)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatus(value)
    setPage(1)
  }, [])

  const handleAccountChange = useCallback((value: string) => {
    setAccountId(value)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((pageIndex: number) => setPage(pageIndex + 1), [])
  const handlePageSizeChange = useCallback((size: number) => {
    setLimit(size)
    setPage(1)
  }, [])

  const handlePublish = useCallback(
    (post: FacebookPost) => publishMutation.mutate(post.id),
    [publishMutation],
  )

  const handleCancelSchedule = useCallback(
    (post: FacebookPost) => cancelScheduleMutation.mutate(post.id),
    [cancelScheduleMutation],
  )

  const handleConfirmDelete = useCallback(
    (deleteOnFacebook: boolean) => {
      if (!deletingPost) return
      deleteMutation.mutate(
        { id: deletingPost.id, deleteOnFacebook },
        { onSuccess: () => setDeletingPost(null) },
      )
    },
    [deletingPost, deleteMutation],
  )

  const handleConfirmReschedule = useCallback(
    (scheduledAt: string) => {
      if (!reschedulingPost) return
      rescheduleMutation.mutate(
        { id: reschedulingPost.id, scheduledAt },
        { onSuccess: () => setReschedulingPost(null) },
      )
    },
    [reschedulingPost, rescheduleMutation],
  )

  return {
    // data
    posts: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    refetch,
    isConfigured: isFacebookConfigured,
    accounts,
    // filters / pagination
    page,
    limit,
    search,
    status,
    accountId,
    handleSearchChange,
    handleStatusChange,
    handleAccountChange,
    handlePageChange,
    handlePageSizeChange,
    // row actions
    handlePublish,
    handleCancelSchedule,
    isPublishing: publishMutation.isPending,
    // dialogs
    deletingPost,
    setDeletingPost,
    reschedulingPost,
    setReschedulingPost,
    handleConfirmDelete,
    handleConfirmReschedule,
    isDeleting: deleteMutation.isPending,
    isRescheduling: rescheduleMutation.isPending,
  }
}
