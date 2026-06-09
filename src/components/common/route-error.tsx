import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

/** errorElement cho router — hiển thị lỗi điều hướng/route một cách thân thiện. */
export const RouteError = () => {
  const error = useRouteError()

  let title = 'Đã có lỗi xảy ra'
  let message = 'Vui lòng thử lại sau.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message ?? 'Không tìm thấy trang bạn yêu cầu.'
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle className="size-12 text-destructive" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button asChild>
        <Link to="/">Về trang chủ</Link>
      </Button>
    </div>
  )
}
