import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export const NotFoundPage = () => (
  <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-6xl font-bold text-muted-foreground">404</p>
    <h1 className="text-xl font-semibold">Không tìm thấy trang</h1>
    <p className="text-sm text-muted-foreground">
      Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
    </p>
    <Button asChild>
      <Link to="/">Về trang chủ</Link>
    </Button>
  </div>
)
