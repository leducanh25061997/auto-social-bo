import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/** Số record mặc định hiển thị trên 1 trang (BẮT BUỘC mặc định = 10). */
export const DEFAULT_PAGE_SIZE = 10
/** Các lựa chọn số record / trang cho dropdown. */
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

export interface DataTableColumn<T> {
  /** Khoá duy nhất của cột. */
  id: string
  header: ReactNode
  /** Hàm render nội dung ô từ một dòng dữ liệu. */
  cell: (row: T) => ReactNode
  /** Class cho ô <td>. */
  className?: string
  /** Class cho ô tiêu đề <th>. */
  headerClassName?: string
}

/**
 * Cấu hình phân trang SERVER-SIDE (controlled). Khi truyền prop này, DataTable
 * KHÔNG tự cắt `data` — `data` được hiểu là đúng trang hiện tại do server trả về.
 */
export interface ManualPagination {
  /** Trang hiện tại (0-based). */
  pageIndex: number
  pageSize: number
  /** Tổng số record trên toàn bộ tập (để tính số trang). */
  total: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  /** Lấy id ổn định cho mỗi dòng (dùng làm React key). */
  getRowId: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  pageSize?: number
  pageSizeOptions?: readonly number[]
  /** Bật phân trang server-side. Bỏ trống = phân trang client-side (mặc định). */
  pagination?: ManualPagination
  className?: string
}

/**
 * Bảng dữ liệu dùng chung cho TOÀN dự án.
 *
 * Quy ước bắt buộc: mọi bảng đều có phân trang + ô chọn số record/trang, mặc định 10.
 * - Mặc định: phân trang CLIENT-SIDE (tự cắt mảng `data`).
 * - Truyền `pagination`: phân trang SERVER-SIDE (controlled) — `data` là trang hiện tại,
 *   các nút/Select gọi callback để cha refetch. Chữ ký cột giữ nguyên ở cả 2 chế độ.
 *
 * Vì đã giới hạn số dòng render theo `pageSize`, bảng không cần memo toàn bộ;
 * chi phí render luôn nằm trong 1 trang.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu.',
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pagination,
  className,
}: DataTableProps<T>) {
  const isManual = pagination !== undefined

  // State nội bộ chỉ dùng ở chế độ client-side.
  const [innerPageSize, setInnerPageSize] = useState(initialPageSize)
  const [innerPageIndex, setInnerPageIndex] = useState(0) // 0-based

  // Giá trị hiệu lực: lấy từ props (server-side) hoặc state nội bộ (client-side).
  const pageSize = isManual ? pagination.pageSize : innerPageSize
  const pageIndex = isManual ? pagination.pageIndex : innerPageIndex
  const total = isManual ? pagination.total : data.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  // (client-side) Giữ pageIndex hợp lệ khi data/pageSize đổi (vd: sau khi lọc).
  useEffect(() => {
    if (!isManual && innerPageIndex > pageCount - 1) {
      setInnerPageIndex(pageCount - 1)
    }
  }, [isManual, innerPageIndex, pageCount])

  // client-side cắt trang; server-side render nguyên data của trang hiện tại.
  const pageRows = useMemo(() => {
    if (isManual) return data
    const start = innerPageIndex * innerPageSize
    return data.slice(start, start + innerPageSize)
  }, [isManual, data, innerPageIndex, innerPageSize])

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(0, next), pageCount - 1)
    if (isManual) pagination.onPageChange(clamped)
    else setInnerPageIndex(clamped)
  }

  const handlePageSizeChange = (value: string) => {
    const size = Number(value)
    if (isManual) pagination.onPageSizeChange(size)
    else {
      setInnerPageSize(size)
      setInnerPageIndex(0) // đổi số record/trang thì về trang đầu
    }
  }

  // Khoảng record đang hiển thị: "X–Y trên Z"
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)

  const skeletonRows = Array.from({ length: pageSize }, (_, i) => i)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn('text-xs font-semibold uppercase tracking-wide text-slate-500', col.headerClassName)}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              skeletonRows.map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  className="border-slate-100 transition-colors hover:bg-accent/60"
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Thanh phân trang — luôn hiển thị */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Số dòng / trang</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">
            {from}–{to} trên {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => goToPage(0)}
              disabled={pageIndex === 0}
              aria-label="Trang đầu"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => goToPage(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Trang trước"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-1 whitespace-nowrap text-foreground">
              Trang {pageIndex + 1}/{pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => goToPage(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
              aria-label="Trang sau"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => goToPage(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
              aria-label="Trang cuối"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
