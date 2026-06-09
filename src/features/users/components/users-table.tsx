import { useMemo } from 'react'
import { KeyRound, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { RoleBadge } from '@/features/users/components/role-badge'
import { formatDate } from '@/features/users/utils/user.utils'
import type { User } from '@/features/users/types/user.types'

interface UsersTableProps {
  users: User[]
  total: number
  isLoading: boolean
  /** Phân trang server-side (page 1-based ở cha; quy đổi 0-based cho DataTable). */
  page: number
  limit: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  /** Id người đang đăng nhập — để chặn tự xoá. */
  currentUserId?: string
  onEdit: (user: User) => void
  onResetPassword: (user: User) => void
  onDelete: (user: User) => void
}

export const UsersTable = ({
  users,
  total,
  isLoading,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  currentUserId,
  onEdit,
  onResetPassword,
  onDelete,
}: UsersTableProps) => {
  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: 'username',
        header: 'Tên đăng nhập',
        cell: (u) => <span className="font-medium">{u.username}</span>,
      },
      {
        id: 'name',
        header: 'Họ tên',
        cell: (u) => u.name ?? <span className="text-muted-foreground">—</span>,
      },
      {
        id: 'email',
        header: 'Email',
        cell: (u) =>
          u.email ?? <span className="text-muted-foreground">—</span>,
      },
      {
        id: 'role',
        header: 'Vai trò',
        cell: (u) => <RoleBadge role={u.role} />,
      },
      {
        id: 'createdAt',
        header: 'Ngày tạo',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (u) => formatDate(u.createdAt),
      },
      {
        id: 'actions',
        header: 'Hành động',
        headerClassName: 'w-[60px] text-right',
        className: 'text-right',
        cell: (u) => {
          const isSelf = u.id === currentUserId
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Mở menu hành động">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(u)}>
                  <Pencil className="size-4" />
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResetPassword(u)}>
                  <KeyRound className="size-4" />
                  Đặt lại mật khẩu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(u)}
                  disabled={isSelf}
                >
                  <Trash2 className="size-4" />
                  {isSelf ? 'Không thể tự xoá' : 'Xoá'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [currentUserId, onEdit, onResetPassword, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={users}
      getRowId={(u) => u.id}
      isLoading={isLoading}
      emptyMessage="Không tìm thấy người dùng nào."
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
