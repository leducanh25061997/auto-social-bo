import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/ui/alert'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
  type User,
} from '@/features/users/types/user.types'

interface ResetPasswordDialogProps {
  user: User | null
  isResetting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => void
}

/** Admin đặt lại mật khẩu cho user — buộc người đó đăng nhập lại. */
export const ResetPasswordDialog = ({
  user,
  isResetting,
  onOpenChange,
  onConfirm,
}: ResetPasswordDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  })

  useEffect(() => {
    if (user) reset({ password: '' })
  }, [user, reset])

  return (
    <Dialog open={user !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Đặt mật khẩu mới cho{' '}
            <span className="font-medium text-foreground">{user?.username}</span>.
          </DialogDescription>
        </DialogHeader>

        <form
          id="reset-password-form"
          className="space-y-4"
          onSubmit={handleSubmit((v) => onConfirm(v.password))}
          noValidate
        >
          <AppAlert variant="warning">
            Mọi phiên đăng nhập hiện tại của người dùng sẽ bị thu hồi.
          </AppAlert>
          <div className="space-y-2">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự, có hoa/thường/số"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isResetting}>
            Huỷ
          </Button>
          <Button type="submit" form="reset-password-form" loading={isResetting}>
            {isResetting ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
