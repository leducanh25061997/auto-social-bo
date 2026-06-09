import { memo } from 'react'
import { Loader2, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PLATFORMS,
  POST_STATUSES,
  type Platform,
  type PostListParams,
  type PostStatus,
} from '@/features/posts/types/post.types'
import { PLATFORM_LABELS, STATUS_LABELS } from '@/features/posts/utils/post.utils'

interface PostsFiltersProps {
  filters: PostListParams
  onChange: (next: Partial<PostListParams>) => void
  /** Đang refetch ngầm (đổi filter/tìm kiếm) — hiển thị spinner nhỏ trong ô tìm kiếm. */
  isFetching?: boolean
}

/** Thanh lọc danh sách: tìm kiếm + lọc theo nền tảng + trạng thái. */
export const PostsFilters = memo(function PostsFilters({
  filters,
  onChange,
  isFetching = false,
}: PostsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Tìm theo nội dung..."
          className="pl-8 pr-8"
        />
        {isFetching && (
          <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <Select
        value={filters.platform ?? 'all'}
        onValueChange={(value) => onChange({ platform: value as Platform | 'all' })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Nền tảng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả nền tảng</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={(value) => onChange({ status: value as PostStatus | 'all' })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {POST_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})
