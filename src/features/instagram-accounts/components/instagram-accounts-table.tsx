import { useMemo } from 'react'
import { MoreHorizontal, Pencil, Power, RefreshCw, Trash2 } from 'lucide-react'

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
import { formatDateTime } from '@/features/instagram-accounts/utils/format'
import type { InstagramAccount } from '@/features/instagram-accounts/types/instagram-account.types'

interface InstagramAccountsTableProps {
  accounts: InstagramAccount[]
  total: number
  isLoading: boolean
  page: number
  limit: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEdit: (account: InstagramAccount) => void
  onToggleActive: (account: InstagramAccount) => void
  onRefresh: (account: InstagramAccount) => void
  onDelete: (account: InstagramAccount) => void
}

export const InstagramAccountsTable = ({
  accounts,
  total,
  isLoading,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onToggleActive,
  onRefresh,
  onDelete,
}: InstagramAccountsTableProps) => {
  const columns = useMemo<DataTableColumn<InstagramAccount>[]>(
    () => [
      {
        id: 'username',
        header: 'Tài khoản',
        cell: (a) => (
          <div className="flex items-center gap-3">
            <Avatar>
              {a.picture && <AvatarImage src={a.picture} alt={a.username} />}
              <AvatarFallback>{a.username[0]?.toUpperCase() ?? 'IG'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <a
                href={`https://www.instagram.com/${a.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-slate-900 transition-colors hover:text-primary"
              >
                @{a.username}
              </a>
              {a.name && (
                <div className="truncate text-xs text-muted-foreground">{a.name}</div>
              )}
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
    [onEdit, onToggleActive, onRefresh, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={accounts}
      getRowId={(a) => a.id}
      isLoading={isLoading}
      emptyMessage="Chưa có tài khoản Instagram nào. Hãy bấm “Kết nối Instagram” để thêm."
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
