import { memo, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Bot } from 'lucide-react'

import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/config/navigation'
import { useUiStore } from '@/stores/ui-store'
import { useAuth } from '@/features/auth/hooks/use-auth'

/**
 * Sidebar điều hướng chính.
 * Lọc menu theo vai trò: mục `adminOnly` chỉ hiện với ADMIN.
 */
export const Sidebar = memo(function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const { hasRole } = useAuth()

  const items = useMemo(
    () => NAV_ITEMS.filter((item) => !item.adminOnly || hasRole('ADMIN')),
    [hasRole],
  )

  return (
    <aside
      className={cn(
        'hidden shrink-0 border-r border-slate-200 bg-card transition-[width] duration-200 md:flex md:flex-col',
        collapsed ? 'md:w-16' : 'md:w-60',
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-slate-100 px-4">
        {/* Logo trong ô gradient — điểm nhấn thương hiệu. */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/30">
          <Bot className="size-5" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-slate-900">
            Auto Social Bot
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm shadow-blue-500/5'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
})
