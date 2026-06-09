import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import {
  createUser,
  deleteUser,
  resetUserPassword,
  updateUser,
} from '@/features/users/api/users.api'
import { userKeys } from '@/features/users/hooks/query-keys'
import type {
  CreateUserPayload,
  UpdateUserPayload,
} from '@/features/users/types/user.types'

/**
 * Gộp các mutation cho User (tạo / sửa / xoá / đặt lại mật khẩu).
 * Mỗi mutation tự invalidate danh sách + bắn toast phản hồi (qua `notify`).
 */
export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: userKeys.lists() })

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã tạo người dùng')
    },
    onError: (error) => notify.apiError(error, 'Tạo người dùng thất bại'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã cập nhật người dùng')
    },
    onError: (error) => notify.apiError(error, 'Cập nhật thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã xoá người dùng')
    },
    onError: (error) => notify.apiError(error, 'Xoá thất bại'),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      resetUserPassword(id, password),
    onSuccess: () =>
      notify.success('Đã đặt lại mật khẩu', 'Người dùng sẽ phải đăng nhập lại.'),
    onError: (error) => notify.apiError(error, 'Đặt lại mật khẩu thất bại'),
  })

  return { createMutation, updateMutation, deleteMutation, resetPasswordMutation }
}
