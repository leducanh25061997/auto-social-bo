import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { applyApiFieldErrors, getApiErrorMessage } from '@/lib/api-error'
import { useChangePassword } from '@/features/profile/hooks/use-profile-mutations'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/profile/types/profile.types'

/**
 * Card đổi mật khẩu. Đổi thành công -> backend thu hồi mọi phiên -> điều hướng
 * về /login để đăng nhập lại bằng mật khẩu mới.
 */
export const ChangePasswordForm = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useChangePassword()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => navigate('/login', { replace: true }),
        // Map lỗi backend vào field; nếu không phải lỗi field thì hiện lỗi chung.
        onError: (error) => {
          if (!applyApiFieldErrors(error, setError)) {
            setError('root', { message: getApiErrorMessage(error) })
          }
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
        <CardDescription>
          Sau khi đổi, bạn sẽ bị đăng xuất khỏi mọi thiết bị và cần đăng nhập lại.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự, có hoa/thường/số"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && <AppAlert variant="destructive">{errors.root.message}</AppAlert>}

          <Button type="submit" loading={isPending}>
            {isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
