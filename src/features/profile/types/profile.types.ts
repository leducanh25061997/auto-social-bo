import { z } from 'zod'

/** Form cập nhật hồ sơ cá nhân (name, email). */
export const updateProfileSchema = z.object({
  name: z.string().max(100, 'Tên tối đa 100 ký tự').optional(),
  email: z.string().email('Email không hợp lệ').or(z.literal('')).optional(),
})
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

/** Form đổi mật khẩu của chính mình (khớp policy backend + xác nhận trùng khớp). */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .max(128, 'Mật khẩu tối đa 128 ký tự')
      .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
      .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Cần ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  })
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

/** Payload gửi API. */
export interface UpdateProfilePayload {
  name?: string | null
  email?: string | null
}
export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
