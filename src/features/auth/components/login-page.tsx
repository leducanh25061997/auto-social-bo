import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AppAlert } from '@/components/ui/alert'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoginForm } from '@/features/auth/components/login-form'

interface LocationState {
  from?: { pathname: string }
}

/**
 * Trang đăng nhập (public). Nếu đã đăng nhập thì điều hướng về trang trước đó
 * (hoặc trang chủ) — tránh hiển thị lại form cho người đã có phiên.
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Trang người dùng định vào trước khi bị chặn (deep-link), mặc định '/'.
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-sm animate-fade-in-up space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30">
            <Bot className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Auto Social Bot</h1>
          <p className="text-sm text-slate-500">
            Đăng nhập để quản lý nội dung tự động
          </p>
        </div>

        <Card className="shadow-md shadow-blue-500/5">
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>Nhập email và mật khẩu của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm onSuccess={() => navigate(from, { replace: true })} />

            {/* Gợi ý tài khoản demo (vì đang dùng mock API — bỏ khi nối backend thật). */}
            <AppAlert variant="info" title="Tài khoản demo">
              <span className="font-mono text-xs">admin@example.com / Admin@123</span>
            </AppAlert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
