import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/ui/alert'
import { getApiErrorMessage } from '@/lib/api-error'
import { useLogin } from '@/features/auth/hooks/use-auth-mutations'
import { loginSchema, type LoginFormValues } from '@/features/auth/types/auth.types'

interface LoginFormProps {
  /** Gọi khi đăng nhập thành công (điều hướng do trang cha quyết định). */
  onSuccess: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isPending, error, isError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  })

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, { onSuccess })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Lỗi xác thực: thông báo CHUNG CHUNG, không tiết lộ sai tên đăng nhập hay mật khẩu. */}
      {isError && (
        <AppAlert variant="destructive">
          {getApiErrorMessage(error, 'Đăng nhập thất bại')}
        </AppAlert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="adminleducanh"
          aria-invalid={Boolean(errors.username)}
          {...register('username')}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className="pr-10"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-0 flex h-9 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className={cn(
              'size-4 cursor-pointer rounded border-input accent-primary',
            )}
            {...register('rememberMe')}
          />
          Ghi nhớ đăng nhập
        </label>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          // Liên kết tới luồng quên mật khẩu (chưa triển khai trong demo này).
        >
          Quên mật khẩu?
        </button>
      </div>

      <Button type="submit" className="w-full" loading={isPending}>
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  )
}
