import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyApiFieldErrors } from '@/lib/api-error'
import {
  createUserSchema,
  updateUserSchema,
  USER_ROLES,
  type CreateUserFormValues,
  type User,
  type UserRole,
} from '@/features/users/types/user.types'
import { ROLE_LABELS } from '@/features/users/utils/user.utils'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Có giá trị khi sửa; undefined khi tạo mới. */
  user?: User
  isSubmitting: boolean
  /** Ném lỗi khi thất bại để form map vào từng ô input. */
  onSubmit: (values: CreateUserFormValues) => Promise<void>
}

const EMPTY: CreateUserFormValues = {
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'USER',
}

/**
 * Dialog tạo/sửa người dùng (RHF + Zod). Khi sửa: ẩn username (không cho đổi) &
 * mật khẩu (đặt lại qua chức năng riêng); chỉ sửa tên, email, vai trò.
 */
export const UserFormDialog = ({
  open,
  onOpenChange,
  user,
  isSubmitting,
  onSubmit,
}: UserFormDialogProps) => {
  const isEdit = Boolean(user)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    // Schema đổi theo chế độ; cùng shape nên type form không đổi.
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: EMPTY,
  })

  // Await submit; nếu backend trả lỗi validation thì map vào từng ô input.
  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      applyApiFieldErrors(error, setError)
    }
  })

  useEffect(() => {
    if (!open) return
    reset(
      user
        ? {
            username: user.username,
            name: user.name ?? '',
            email: user.email ?? '',
            password: '',
            role: user.role,
          }
        : EMPTY,
    )
  }, [open, user, reset])

  const role = watch('role')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa người dùng' : 'Tạo người dùng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin và vai trò của người dùng.'
              : 'Tạo tài khoản mới và gán vai trò.'}
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" className="space-y-4" onSubmit={submit} noValidate>
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                autoComplete="off"
                placeholder="vd: nguyenvana"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Họ tên</Label>
            <Input id="name" placeholder="Nguyễn Văn A" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (tuỳ chọn)</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Tối thiểu 8 ký tự, có hoa/thường/số"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue('role', value as UserRole, { shouldValidate: true })
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Huỷ
          </Button>
          <Button type="submit" form="user-form" loading={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
