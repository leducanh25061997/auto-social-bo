import type { DashboardData } from '@/features/dashboard/types/stats.types'

/** MOCK — thay bằng `apiClient.get<DashboardData>('/dashboard')` khi có backend. */
export const getDashboardData = async (): Promise<DashboardData> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    stats: [
      { key: 'scheduled', label: 'Bài đã lên lịch', value: 24, changePct: 12.5 },
      { key: 'published', label: 'Đã đăng (tháng)', value: 186, changePct: 8.2 },
      { key: 'engagement', label: 'Lượt tương tác', value: 14_320, changePct: -3.1 },
      { key: 'accounts', label: 'Tài khoản kết nối', value: 7, changePct: 0 },
    ],
  }
}
