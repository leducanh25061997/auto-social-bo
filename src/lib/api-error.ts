import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { ApiError } from '@/lib/api-client'

/**
 * Envelope lỗi của backend: { status, message, errors?: { field: string[] } }.
 * `ApiError.data` chính là envelope này.
 */
interface ApiErrorEnvelope {
  message?: string
  errors?: Record<string, string[]>
}

/** Lấy map lỗi theo từng field (validation) nếu có. */
export const getApiFieldErrors = (
  error: unknown,
): Record<string, string[]> | undefined => {
  if (error instanceof ApiError && error.data && typeof error.data === 'object') {
    const { errors } = error.data as ApiErrorEnvelope
    if (errors && typeof errors === 'object') return errors
  }
  return undefined
}

/**
 * Trả về thông báo lỗi RÕ NGHĨA cho người dùng:
 * ưu tiên gộp chi tiết validation từng field (vd "Mật khẩu cần ít nhất 1 chữ hoa"),
 * nếu không có thì dùng message chung của lỗi.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Đã có lỗi xảy ra, vui lòng thử lại',
): string => {
  const fieldErrors = getApiFieldErrors(error)
  if (fieldErrors) {
    const messages = Object.values(fieldErrors).flat().filter(Boolean)
    // Giới hạn 3 dòng để toast không quá dài.
    if (messages.length) return messages.slice(0, 3).join(' ')
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

/**
 * Ánh xạ lỗi validation của backend vào từng ô input của React Hook Form
 * (hiển thị lỗi ngay dưới field). Trả về `true` nếu có áp được lỗi field nào.
 * Field `_` (lỗi chung) map sang `root`.
 */
export const applyApiFieldErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean => {
  const fieldErrors = getApiFieldErrors(error)
  if (!fieldErrors) return false

  let applied = false
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages?.length) continue
    const name = (field === '_' ? 'root' : field) as Path<T>
    setError(name, { type: 'server', message: messages[0] })
    applied = true
  }
  return applied
}
