import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  /** Vùng hành động bên phải (ví dụ nút "Tạo mới"). */
  actions?: ReactNode
  className?: string
}

/** Tiêu đề trang dùng chung, đặt ở đầu mỗi page. */
export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => (
  <div
    className={cn(
      'mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
      className,
    )}
  >
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
)
