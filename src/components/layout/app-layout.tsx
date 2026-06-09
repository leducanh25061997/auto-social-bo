import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { PageLoader } from '@/components/common/page-loader'

/**
 * Khung layout chính của ứng dụng (sidebar + header + vùng nội dung).
 * - Đồng bộ theme vào thẻ <html> qua side effect.
 * - Bọc <Outlet/> trong <Suspense> để hỗ trợ lazy-loaded routes (code splitting).
 */
export const AppLayout = () => {
  const location = useLocation()

  // App dùng giao diện SÁNG (light-only) — luôn gỡ class 'dark' nếu còn sót
  // (vd: theme 'dark' cũ trong localStorage từ phiên trước).
  useEffect(() => {
    window.document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<PageLoader />}>
            {/* key theo pathname để chạy lại hiệu ứng vào trang mỗi lần đổi route. */}
            <div key={location.pathname} className="animate-fade-in-up">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
