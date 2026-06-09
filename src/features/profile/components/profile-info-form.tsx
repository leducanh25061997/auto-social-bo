import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { applyApiFieldErrors } from '@/lib/api-error'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useUpdateProfile } from '@/features/profile/hooks/use-profile-mutations'
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/features/profile/types/profile.types'

/** Card xem & sửa thông tin hồ sơ cá nhân (họ tên, email). */
export const ProfileInfoForm = () => {
  const { user } = useAuth()
  const { mutate, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '', email: '' },
  })

  // Nạp dữ liệu user vào form khi có.
  useEffect(() => {
    if (user) reset({ name: user.name ?? '', email: user.email ?? '' })
  }, [user, reset])

  const onSubmit = (values: UpdateProfileFormValues) => {
    mutate(
      { name: values.name || null, email: values.email || null },
      {
        onSuccess: (updated) =>
          reset({ name: updated.name ?? '', email: updated.email ?? '' }),
        onError: (error) => applyApiFieldErrors(error, setError),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Tên đăng nhập <span className="font-medium text-foreground">{user?.username}</span>{' '}
          không thể thay đổi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Họ tên</Label>
            <Input id="profile-name" placeholder="Nguyễn Văn A" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" loading={isPending} disabled={!isDirty}>
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
