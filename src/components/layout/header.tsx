import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUiStore } from '@/stores/ui-store'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'

/** Lấy 2 ký tự viết tắt từ tên để làm avatar fallback. */
const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'U'

export const Header = memo(function Header() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const { user } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()

  // useCallback: handler ổn định, phòng khi truyền xuống component con đã memo.
  const onLogout = useCallback(() => logout.mutate(), [logout])

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-card/80 px-4 backdrop-blur-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Bật/tắt sidebar"
      >
        <Menu className="size-5" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? 'Người dùng'} />
                <AvatarFallback>{getInitials(user?.name ?? 'U')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="truncate font-medium">
                {user?.name ?? user?.username ?? 'Người dùng'}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.email ?? (user?.username ? `@${user.username}` : null)}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onLogout}
              disabled={logout.isPending}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
})
