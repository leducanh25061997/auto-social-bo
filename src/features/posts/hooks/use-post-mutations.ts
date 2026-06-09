import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import { createPost, deletePost, updatePost } from '@/features/posts/api/posts.api'
import { postKeys } from '@/features/posts/hooks/query-keys'
import type { PostPayload } from '@/features/posts/types/post.types'

/**
 * Hook gộp các mutation cho Post (tạo / sửa / xoá).
 * Mỗi mutation tự invalidate danh sách và bắn toast phản hồi (qua `notify`).
 */
export const usePostMutations = () => {
  const queryClient = useQueryClient()

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: postKeys.lists() })

  const createMutation = useMutation({
    mutationFn: (payload: PostPayload) => createPost(payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã tạo bài đăng', 'Bài đăng đã được lên lịch.')
    },
    onError: (error) => notify.apiError(error, 'Tạo bài đăng thất bại'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã cập nhật', 'Thay đổi đã được lưu.')
    },
    onError: (error) => notify.apiError(error, 'Cập nhật thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã xoá bài đăng')
    },
    onError: (error) => notify.apiError(error, 'Xoá thất bại'),
  })

  return { createMutation, updateMutation, deleteMutation }
}
