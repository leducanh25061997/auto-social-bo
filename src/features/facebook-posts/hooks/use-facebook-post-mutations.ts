import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import {
  cancelScheduleFacebookPost,
  deleteFacebookPost,
  publishFacebookPost,
  rescheduleFacebookPost,
} from '@/features/facebook-posts/api/facebook-posts.api'
import { facebookPostKeys } from '@/features/facebook-posts/hooks/query-keys'

/**
 * Mutation cho các hành động ở danh sách bài đăng (đăng ngay / đổi lịch / huỷ lịch /
 * xoá). Mỗi mutation tự invalidate danh sách + bắn toast tiếng Việt.
 */
export const useFacebookPostMutations = () => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: facebookPostKeys.all })

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishFacebookPost(id),
    onSuccess: () => {
      invalidate()
      notify.success('Đã đăng bài lên Facebook')
    },
    onError: (error) => notify.apiError(error, 'Đăng bài thất bại'),
  })

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      rescheduleFacebookPost(id, scheduledAt),
    onSuccess: () => {
      invalidate()
      notify.success('Đã đổi lịch đăng')
    },
    onError: (error) => notify.apiError(error, 'Đổi lịch thất bại'),
  })

  const cancelScheduleMutation = useMutation({
    mutationFn: (id: string) => cancelScheduleFacebookPost(id),
    onSuccess: () => {
      invalidate()
      notify.success('Đã huỷ lịch — bài chuyển về nháp')
    },
    onError: (error) => notify.apiError(error, 'Huỷ lịch thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, deleteOnFacebook }: { id: string; deleteOnFacebook?: boolean }) =>
      deleteFacebookPost(id, deleteOnFacebook),
    onSuccess: () => {
      invalidate()
      notify.success('Đã xoá bài đăng')
    },
    onError: (error) => notify.apiError(error, 'Xoá thất bại'),
  })

  return { publishMutation, rescheduleMutation, cancelScheduleMutation, deleteMutation }
}
