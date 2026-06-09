/** Một chỉ số tổng quan hiển thị trên dashboard. */
export interface DashboardStat {
  key: string
  label: string
  value: number
  /** % thay đổi so với kỳ trước (dương = tăng). */
  changePct: number
}

export interface DashboardData {
  stats: DashboardStat[]
}
