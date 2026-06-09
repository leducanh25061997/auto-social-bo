import { format, parseISO } from 'date-fns'

import type { BadgeProps } from '@/components/ui/badge'
import type { Platform, PostStatus } from '@/features/posts/types/post.types'

/** Nhãn tiếng Việt cho từng nền tảng. */
export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

/** Nhãn tiếng Việt cho từng trạng thái. */
export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Nháp',
  scheduled: 'Đã lên lịch',
  published: 'Đã đăng',
  failed: 'Thất bại',
}

/** Map trạng thái -> variant của Badge để hiển thị màu nhất quán. */
export const STATUS_BADGE_VARIANT: Record<PostStatus, BadgeProps['variant']> = {
  draft: 'secondary',
  scheduled: 'warning',
  published: 'success',
  failed: 'destructive',
}

/** Định dạng ISO datetime -> chuỗi hiển thị (dd/MM/yyyy HH:mm). */
export const formatDateTime = (iso: string): string => {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy HH:mm')
  } catch {
    return iso
  }
}

/** Chuyển ISO -> giá trị cho <input type="datetime-local"> (YYYY-MM-DDTHH:mm). */
export const toDateTimeLocal = (iso: string): string => {
  try {
    return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm")
  } catch {
    return ''
  }
}
