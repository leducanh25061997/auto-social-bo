import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import {
  connectInstagramAccount,
  deleteInstagramAccount,
  exchangeInstagramAccount,
  refreshInstagramAccount,
  updateInstagramAccount,
} from '@/features/instagram-accounts/api/instagram-accounts.api'
import { instagramAccountKeys } from '@/features/instagram-accounts/hooks/query-keys'
import type {
  ConnectInstagramPayload,
  ExchangeInstagramPayload,
} from '@/features/instagram-accounts/types/instagram-account.types'

/**
 * Gộp các mutation cho tài khoản Instagram (kết nối / sửa / xoá / gia hạn token).
 * Mỗi mutation tự invalidate danh sách + bắn toast tiếng Việt thân thiện.
 */
export const useInstagramAccountMutations = () => {
  const queryClient = useQueryClient()

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: instagramAccountKeys.lists() })

  // Bước 1: đổi code lấy hồ sơ xem trước (không tạo gì, không toast thành công).
  const exchangeMutation = useMutation({
    mutationFn: (payload: ExchangeInstagramPayload) => exchangeInstagramAccount(payload),
    onError: (error) => notify.apiError(error, 'Đăng nhập Instagram thất bại'),
  })

  // Bước 2: xác nhận tạo tài khoản.
  const connectMutation = useMutation({
    mutationFn: (payload: ConnectInstagramPayload) => connectInstagramAccount(payload),
    onSuccess: (account) => {
      invalidateList()
      notify.success('Đã tạo tài khoản Instagram', `Tài khoản: @${account.username}`)
    },
    onError: (error) => notify.apiError(error, 'Tạo tài khoản thất bại'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; isActive?: boolean } }) =>
      updateInstagramAccount(id, payload),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã cập nhật tài khoản')
    },
    onError: (error) => notify.apiError(error, 'Cập nhật thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInstagramAccount(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã xoá tài khoản Instagram')
    },
    onError: (error) => notify.apiError(error, 'Xoá thất bại'),
  })

  const refreshMutation = useMutation({
    mutationFn: (id: string) => refreshInstagramAccount(id),
    onSuccess: () => {
      invalidateList()
      notify.success('Đã gia hạn kết nối Instagram')
    },
    onError: (error) => notify.apiError(error, 'Gia hạn thất bại'),
  })

  return { exchangeMutation, connectMutation, updateMutation, deleteMutation, refreshMutation }
}
