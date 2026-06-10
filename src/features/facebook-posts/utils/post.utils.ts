import type { BadgeProps } from '@/components/ui/badge'
import type { FacebookPostStatus } from '@/features/facebook-posts/types/facebook-post.types'

/** Nhãn + màu badge cho từng trạng thái bài đăng. */
export const POST_STATUS_META: Record<
  FacebookPostStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  draft: { label: 'Nháp', variant: 'secondary' },
  scheduled: { label: 'Đã lên lịch', variant: 'default' },
  processing: { label: 'Đang đăng', variant: 'warning' },
  published: { label: 'Đã đăng', variant: 'success' },
  failed: { label: 'Thất bại', variant: 'destructive' },
}

/** Tab lọc nhanh theo trạng thái (giá trị rỗng = tất cả). */
export const POST_STATUS_TABS: { value: FacebookPostStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Nháp' },
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'published', label: 'Đã đăng' },
  { value: 'failed', label: 'Thất bại' },
]

/** Lấy URL hiển thị của 1 ảnh (ưu tiên url tuyệt đối, fallback path). */
export const imageSrc = (img: { imageUrl?: string; imagePath?: string }): string =>
  img.imageUrl || img.imagePath || ''

/** Số phút tối thiểu phải cách hiện tại khi lên lịch (khớp backend). */
export const MIN_SCHEDULE_LEAD_MINUTES = 5

/** Đổi Date → giá trị cho input[type=datetime-local] (giờ địa phương, không giây). */
export const toDatetimeLocalValue = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/** Giá trị min cho input lịch = hiện tại + lead phút. */
export const minScheduleLocalValue = (): string =>
  toDatetimeLocalValue(new Date(Date.now() + MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000))
