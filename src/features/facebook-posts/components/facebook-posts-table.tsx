import { useMemo } from 'react'
import {
  CalendarClock,
  CalendarX,
  ExternalLink,
  Film,
  Image as ImageIcon,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { formatDateTime } from '@/features/facebook-accounts/utils/format'
import { FacebookPostStatusBadge } from '@/features/facebook-posts/components/facebook-post-status-badge'
import { imageSrc } from '@/features/facebook-posts/utils/post.utils'
import type { FacebookPost } from '@/features/facebook-posts/types/facebook-post.types'

interface FacebookPostsTableProps {
  posts: FacebookPost[]
  total: number
  isLoading: boolean
  page: number
  limit: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEdit: (post: FacebookPost) => void
  onPublish: (post: FacebookPost) => void
  onReschedule: (post: FacebookPost) => void
  onCancelSchedule: (post: FacebookPost) => void
  onDelete: (post: FacebookPost) => void
}

const canEdit = (s: FacebookPost['status']) => s !== 'published' && s !== 'processing'
const canPublish = (s: FacebookPost['status']) =>
  s === 'draft' || s === 'scheduled' || s === 'failed'

export const FacebookPostsTable = ({
  posts,
  total,
  isLoading,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onPublish,
  onReschedule,
  onCancelSchedule,
  onDelete,
}: FacebookPostsTableProps) => {
  const columns = useMemo<DataTableColumn<FacebookPost>[]>(
    () => [
      {
        id: 'content',
        header: 'Nội dung',
        cell: (p) => {
          const thumb = p.postType === 'reel' ? '' : imageSrc(p.images[0] ?? {})
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {thumb ? (
                  <img src={thumb} alt="" className="size-full object-cover" />
                ) : p.postType === 'reel' ? (
                  <Film className="size-5 text-slate-400" />
                ) : (
                  <ImageIcon className="size-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 max-w-[360px]">
                <div className="truncate text-sm text-slate-900">
                  {p.message || <span className="italic text-muted-foreground">(Không có nội dung)</span>}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="px-1.5 py-0">
                    {p.postType === 'reel' ? 'Reel' : 'Bài viết'}
                  </Badge>
                  {p.postType !== 'reel' && p.images.length > 0 && (
                    <span>{p.images.length} ảnh</span>
                  )}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: 'page',
        header: 'Page',
        className: 'whitespace-nowrap',
        cell: (p) => (
          <span className="text-sm text-slate-700">
            {p.pageName || <span className="text-muted-foreground">{p.pageId}</span>}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        className: 'whitespace-nowrap',
        cell: (p) => (
          <div className="space-y-1">
            <FacebookPostStatusBadge status={p.status} />
            {p.status === 'scheduled' && p.scheduledAt && (
              <div className="text-xs text-muted-foreground">{formatDateTime(p.scheduledAt)}</div>
            )}
            {p.status === 'failed' && p.errorMessage && (
              <div className="max-w-[220px] truncate text-xs text-destructive" title={p.errorMessage}>
                {p.errorMessage}
              </div>
            )}
          </div>
        ),
      },
      {
        id: 'updatedAt',
        header: 'Cập nhật',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (p) => formatDateTime(p.publishedAt ?? p.updatedAt ?? p.createdAt),
      },
      {
        id: 'actions',
        header: 'Hành động',
        headerClassName: 'w-[80px] whitespace-nowrap text-right',
        className: 'text-right',
        cell: (p) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Mở menu hành động">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {p.permalinkUrl && (
                <DropdownMenuItem asChild>
                  <a href={p.permalinkUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Xem trên Facebook
                  </a>
                </DropdownMenuItem>
              )}
              {canEdit(p.status) && (
                <DropdownMenuItem onClick={() => onEdit(p)}>
                  <Pencil className="size-4" />
                  Sửa
                </DropdownMenuItem>
              )}
              {canPublish(p.status) && (
                <DropdownMenuItem onClick={() => onPublish(p)}>
                  <Send className="size-4" />
                  Đăng ngay
                </DropdownMenuItem>
              )}
              {canPublish(p.status) && (
                <DropdownMenuItem onClick={() => onReschedule(p)}>
                  <CalendarClock className="size-4" />
                  {p.status === 'scheduled' ? 'Đổi lịch' : 'Lên lịch'}
                </DropdownMenuItem>
              )}
              {p.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => onCancelSchedule(p)}>
                  <CalendarX className="size-4" />
                  Huỷ lịch
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(p)}
              >
                <Trash2 className="size-4" />
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onPublish, onReschedule, onCancelSchedule, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={posts}
      getRowId={(p) => p.id}
      isLoading={isLoading}
      emptyMessage="Chưa có bài đăng nào. Hãy bấm “Tạo bài đăng” để bắt đầu."
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
