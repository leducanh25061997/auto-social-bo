import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'
import { StatCard } from '@/features/dashboard/components/stat-card'

const DashboardPage = () => {
  const { data, isLoading } = useDashboardStats()

  return (
    <div>
      {/* Hero gradient — khu vực nổi bật đầu dashboard. */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 text-white shadow-md shadow-blue-500/20 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <p className="mt-1 max-w-xl text-sm text-blue-50/90">
          Theo dõi hiệu suất tự động hoá mạng xã hội của bạn trong nháy mắt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))
          : data?.stats.map((stat) => <StatCard key={stat.key} stat={stat} />)}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bắt đầu</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Vào mục <span className="font-medium text-foreground">Bài đăng</span> để tạo và
          lên lịch nội dung tự động. Kết nối tài khoản mạng xã hội ở mục{' '}
          <span className="font-medium text-foreground">Tài khoản</span>.
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
