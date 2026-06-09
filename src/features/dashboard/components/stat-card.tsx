import { memo } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStat } from '@/features/dashboard/types/stats.types'

interface StatCardProps {
  stat: DashboardStat
}

/** Định dạng số theo locale VN (1.234.567). */
const formatNumber = (value: number): string => value.toLocaleString('vi-VN')

export const StatCard = memo(function StatCard({ stat }: StatCardProps) {
  const isUp = stat.changePct > 0
  const isDown = stat.changePct < 0
  const TrendIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus

  return (
    <Card className="group relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/10">
      {/* Vệt sáng gradient góc phải — điểm nhấn tinh tế khi hover. */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{formatNumber(stat.value)}</div>
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isUp && 'bg-emerald-500/10 text-emerald-600',
            isDown && 'bg-destructive/10 text-destructive',
            !isUp && !isDown && 'bg-slate-100 text-slate-500',
          )}
        >
          <TrendIcon className="size-3.5" />
          {stat.changePct > 0 ? '+' : ''}
          {stat.changePct}% so với kỳ trước
        </p>
      </CardContent>
    </Card>
  )
})
