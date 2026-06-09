import { useCallback, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGetPosts } from '@/features/posts/hooks/use-posts'
import { usePostMutations } from '@/features/posts/hooks/use-post-mutations'
import type {
  Post,
  PostFormValues,
  PostListParams,
} from '@/features/posts/types/post.types'

/**
 * Hook điều phối toàn bộ logic của trang Posts (tách khỏi tầng View).
 * Quản lý: bộ lọc, dialog tạo/sửa, dialog xoá, và kết nối query + mutations.
 */
export const usePostsPage = () => {
  const [filters, setFilters] = useState<PostListParams>({
    search: '',
    platform: 'all',
    status: 'all',
  })

  // Debounce riêng ô tìm kiếm để không gọi API theo từng ký tự.
  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const queryParams = useMemo<PostListParams>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const { data: posts, isLoading, isFetching, isError, refetch } = useGetPosts(queryParams)
  const { createMutation, updateMutation, deleteMutation } = usePostMutations()

  // ── Trạng thái dialog ─────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined)
  const [deletingPost, setDeletingPost] = useState<Post | null>(null)

  // ── Handlers (useCallback để truyền xuống component con đã memo an toàn) ────
  const handleFilterChange = useCallback((next: Partial<PostListParams>) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }, [])

  const openCreate = useCallback(() => {
    setEditingPost(undefined)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((post: Post) => {
    setEditingPost(post)
    setFormOpen(true)
  }, [])

  const openDelete = useCallback((post: Post) => {
    setDeletingPost(post)
  }, [])

  const handleSubmit = useCallback(
    (values: PostFormValues) => {
      const payload = {
        content: values.content,
        platform: values.platform,
        scheduledAt: values.scheduledAt,
      }

      if (editingPost) {
        updateMutation.mutate(
          { id: editingPost.id, payload },
          { onSuccess: () => setFormOpen(false) },
        )
      } else {
        createMutation.mutate(payload, { onSuccess: () => setFormOpen(false) })
      }
    },
    [editingPost, createMutation, updateMutation],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deletingPost) return
    deleteMutation.mutate(deletingPost.id, {
      onSuccess: () => setDeletingPost(null),
    })
  }, [deletingPost, deleteMutation])

  return {
    // data
    posts: posts ?? [],
    isLoading,
    // isFetching: đang refetch ngầm (đổi filter/tìm kiếm) dù đã có dữ liệu cũ.
    isFetching,
    isError,
    refetch,
    filters,
    // dialog state
    formOpen,
    setFormOpen,
    editingPost,
    deletingPost,
    setDeletingPost,
    // submitting flags
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // handlers
    handleFilterChange,
    openCreate,
    openEdit,
    openDelete,
    handleSubmit,
    handleConfirmDelete,
  }
}
