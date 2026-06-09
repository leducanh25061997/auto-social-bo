import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/routes/router'
import { queryClient } from '@/lib/query-client'
import { Toaster } from '@/components/ui/toaster'
import { AuthBootstrap } from '@/components/auth/auth-bootstrap'
import '@/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Không tìm thấy phần tử #root để mount ứng dụng')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Chặn render tới khi xác định xong trạng thái phiên (silent refresh). */}
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
