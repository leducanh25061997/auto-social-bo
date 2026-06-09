import { useMemo } from 'react'
import {
  LayoutList,
  MoreHorizontal,
  Pencil,
  Power,
  RefreshCw,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { formatDateTime } from '@/features/facebook-accounts/utils/format'
import type { FacebookAccount } from '@/features/facebook-accounts/types/facebook-account.types'

interface FacebookAccountsTableProps {
  accounts: FacebookAccount[]
  total: number
  isLoading: boolean
  page: number
  limit: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onViewPages: (account: FacebookAccount) => void
  onEdit: (account: FacebookAccount) => void
  onToggleActive: (account: FacebookAccount) => void
  onRefresh: (account: FacebookAccount) => void
  onDelete: (account: FacebookAccount) => void
}

/** 2 ký tự đầu của tên để làm avatar fallback. */
const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'FB'

export const FacebookAccountsTable = ({
  accounts,
  total,
  isLoading,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onViewPages,
  onEdit,
  onToggleActive,
  onRefresh,
  onDelete,
}: FacebookAccountsTableProps) => {
  const columns = useMemo<DataTableColumn<FacebookAccount>[]>(
    () => [
      {
        id: 'name',
        header: 'Tài khoản',
        cell: (a) => (
          <div className="flex items-center gap-3">
            <Avatar>
              {a.picture && <AvatarImage src={a.picture} alt={a.name} />}
              <AvatarFallback>{initials(a.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-medium text-slate-900">{a.name}</div>
              <a
                href={`https://www.facebook.com/${a.fbUserId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                ID: {a.fbUserId}
              </a>
            </div>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        cell: (a) => (
          <Badge variant={a.isActive ? 'success' : 'secondary'}>
            {a.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
          </Badge>
        ),
      },
      {
        id: 'lastRefreshedAt',
        header: 'Cập nhật kết nối',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (a) => formatDateTime(a.lastRefreshedAt ?? a.createdAt),
      },
      {
        id: 'actions',
        header: 'Hành động',
        headerClassName: 'w-[60px] text-right',
        className: 'text-right',
        cell: (a) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Mở menu hành động">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewPages(a)}>
                <LayoutList className="size-4" />
                Xem Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(a)}>
                <Pencil className="size-4" />
                Đổi tên
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleActive(a)}>
                <Power className="size-4" />
                {a.isActive ? 'Tạm dừng' : 'Bật lại'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRefresh(a)}>
                <RefreshCw className="size-4" />
                Gia hạn kết nối
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(a)}
              >
                <Trash2 className="size-4" />
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onViewPages, onEdit, onToggleActive, onRefresh, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={accounts}
      getRowId={(a) => a.id}
      isLoading={isLoading}
      emptyMessage="Chưa có tài khoản Facebook nào. Hãy bấm “Kết nối Facebook” để thêm."
      pagination={{
        pageIndex: page - 1,
        pageSize: limit,
        total,
        onPageChange,
        onPageSizeChange,
      }}
    />
  )
}
