import { useQuery } from '@tanstack/react-query'

import { getDashboardData } from '@/features/dashboard/api/dashboard.api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
}

/** Lấy dữ liệu thống kê tổng quan cho dashboard. */
export const useDashboardStats = () =>
  useQuery({
    queryKey: dashboardKeys.all,
    queryFn: getDashboardData,
  })
