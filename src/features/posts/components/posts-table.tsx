import { useMemo } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { PostStatusBadge } from '@/features/posts/components/post-status-badge'
import { PLATFORM_LABELS, formatDateTime } from '@/features/posts/utils/post.utils'
import type { Post } from '@/features/posts/types/post.types'

interface PostsTableProps {
  posts: Post[]
  isLoading: boolean
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}

/**
 * Bảng bài đăng — xây trên `DataTable` dùng chung nên tự động có phân trang +
 * ô chọn số dòng/trang (mặc định 10). Chỉ cần khai báo cấu hình cột.
 */
export const PostsTable = ({ posts, isLoading, onEdit, onDelete }: PostsTableProps) => {
  // useMemo: cấu hình cột chỉ tạo lại khi handler đổi, tránh dựng lại mỗi render.
  const columns = useMemo<DataTableColumn<Post>[]>(
    () => [
      {
        id: 'content',
        header: 'Nội dung',
        headerClassName: 'w-[45%]',
        className: 'max-w-0',
        cell: (post) => <p className="truncate font-medium">{post.content}</p>,
      },
      {
        id: 'platform',
        header: 'Nền tảng',
        cell: (post) => PLATFORM_LABELS[post.platform],
      },
      {
        id: 'status',
        header: 'Trạng thái',
        cell: (post) => <PostStatusBadge status={post.status} />,
      },
      {
        id: 'scheduledAt',
        header: 'Lịch đăng',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (post) => formatDateTime(post.scheduledAt),
      },
      {
        id: 'actions',
        header: 'Hành động',
        headerClassName: 'w-[60px] text-right',
        className: 'text-right',
        cell: (post) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Mở menu hành động">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(post)}>
                <Pencil className="size-4" />
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(post)}
              >
                <Trash2 className="size-4" />
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={posts}
      getRowId={(post) => post.id}
      isLoading={isLoading}
      emptyMessage="Chưa có bài đăng nào khớp bộ lọc."
    />
  )
}
