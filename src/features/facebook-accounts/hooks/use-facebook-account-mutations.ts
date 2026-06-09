import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import {
  connectFacebookAccount,
  deleteFacebookAccount,
  exchangeFacebookAccount,
  refreshFacebookAccount,
  updateFacebookAccount,
} from '@/features/facebook-accounts/api/facebook-accounts.api'
import { facebookAccountKeys } from '@/features/facebook-accounts/hooks/query-keys'
import type {
  ConnectFacebookPayload,
  ExchangeFacebookPayload,
} from '@/features/facebook-accounts/types/facebook-account.types'

/**
 * Gộp các mutation cho tài khoản Facebook (kết nối / sửa / xoá / gia hạn token).
 * Mỗi mutation tự invalidate danh sách + bắn toast tiếng Việt thân thiện.
 */
export const useFacebookAccountMutations = () => {
  const queryClient = useQueryClient()

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: facebookAccountKeys.lists() })

  // Bước 1: đổi code lấy hồ sơ xem trước (không tạo gì, không toast thành công).
  const exchangeMutation = useMutation({
    mutationFn: (payload: ExchangeFacebookPayload) => exchangeFacebookAccount(payload),
    onError: (error) => notify.apiError(error, 'Đăng nhập Facebook thất bại'),
  })

  // Bước 2: xác nhận tạo tài khoản.
  const connectMutation = useMutation({
    mutationFn: (payload: ConnectFacebookPayload) => connectFacebookAccount(payload),
    onSuccess: (account) => {
      invalidateList()
      notify.success('Đã tạo tài khoản Facebook', `Tài khoản: ${account.name}`)
    },
    onError: (error) => notify.apiError(error, 'Tạo tài khoản thất bại'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; isActive?: boolean } }) =>
      updateFacebookAccount(id, payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã cập nhật tài khoản')
    },
    onError: (error) => notify.apiError(error, 'Cập nhật thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFacebookAccount(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã xoá tài khoản Facebook')
    },
    onError: (error) => notify.apiError(error, 'Xoá thất bại'),
  })

  const refreshMutation = useMutation({
    mutationFn: (id: string) => refreshFacebookAccount(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã gia hạn kết nối Facebook')
    },
    onError: (error) => notify.apiError(error, 'Gia hạn thất bại'),
  })

  return { exchangeMutation, connectMutation, updateMutation, deleteMutation, refreshMutation }
}
