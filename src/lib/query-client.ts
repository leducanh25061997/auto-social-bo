import { QueryClient } from '@tanstack/react-query'

/**
 * Cấu hình QueryClient dùng chung toàn app.
 * - staleTime 30s: giảm refetch thừa khi điều hướng nhanh giữa các trang.
 * - retry 1: tránh spam request khi backend lỗi thật.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
