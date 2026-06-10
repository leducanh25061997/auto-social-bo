import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { notify } from '@/lib/notify'
import {
  MIN_SCHEDULE_LEAD_MINUTES,
  minScheduleLocalValue,
  toDatetimeLocalValue,
} from '@/features/facebook-posts/utils/post.utils'
import type { FacebookPost } from '@/features/facebook-posts/types/facebook-post.types'

interface RescheduleFacebookPostDialogProps {
  post: FacebookPost | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (scheduledAtIso: string) => void
}

/** Đặt / đổi thời gian đăng cho 1 bài (nháp / đã lên lịch / thất bại). */
export const RescheduleFacebookPostDialog = ({
  post,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: RescheduleFacebookPostDialogProps) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!post) return
    setValue(
      post.scheduledAt ? toDatetimeLocalValue(new Date(post.scheduledAt)) : minScheduleLocalValue(),
    )
  }, [post])

  const handleConfirm = () => {
    if (!value) {
      notify.warning('Vui lòng chọn thời gian đăng')
      return
    }
    const date = new Date(value)
    if (date.getTime() < Date.now() + MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000) {
      notify.warning(`Thời gian đăng phải cách hiện tại ít nhất ${MIN_SCHEDULE_LEAD_MINUTES} phút`)
      return
    }
    onConfirm(date.toISOString())
  }

  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {post?.status === 'scheduled' ? 'Đổi lịch đăng' : 'Lên lịch đăng'}
          </DialogTitle>
          <DialogDescription>
            Chọn thời điểm hệ thống tự động đăng bài lên Page (múi giờ thiết bị của bạn).
          </DialogDescription>
        </DialogHeader>

        <Input
          type="datetime-local"
          value={value}
          min={minScheduleLocalValue()}
          onChange={(e) => setValue(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Huỷ
          </Button>
          <Button onClick={handleConfirm} loading={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu lịch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
