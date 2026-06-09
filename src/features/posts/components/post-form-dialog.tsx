import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  postFormSchema,
  type Platform,
  type Post,
  type PostFormValues,
} from '@/features/posts/types/post.types'
import { PLATFORM_LABELS, toDateTimeLocal } from '@/features/posts/utils/post.utils'

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Có giá trị khi đang sửa; undefined khi tạo mới. */
  post?: Post
  isSubmitting: boolean
  onSubmit: (values: PostFormValues) => void
}

const EMPTY_VALUES: PostFormValues = {
  content: '',
  platform: 'facebook',
  scheduledAt: '',
}

/**
 * Dialog form tạo/sửa bài đăng dùng React Hook Form + Zod.
 * Logic validate nằm hoàn toàn ở `postFormSchema` (single source of truth).
 */
export const PostFormDialog = ({
  open,
  onOpenChange,
  post,
  isSubmitting,
  onSubmit,
}: PostFormDialogProps) => {
  const isEdit = Boolean(post)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  // Đồng bộ form khi mở dialog: nạp dữ liệu nếu sửa, reset nếu tạo mới.
  useEffect(() => {
    if (!open) return
    reset(
      post
        ? {
            content: post.content,
            platform: post.platform,
            scheduledAt: toDateTimeLocal(post.scheduledAt),
          }
        : EMPTY_VALUES,
    )
  }, [open, post, reset])

  const platform = watch('platform')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa bài đăng' : 'Tạo bài đăng mới'}</DialogTitle>
          <DialogDescription>
            Soạn nội dung, chọn nền tảng và thời gian đăng tự động.
          </DialogDescription>
        </DialogHeader>

        <form
          id="post-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              rows={4}
              placeholder="Nhập nội dung bài đăng..."
              {...register('content')}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Nền tảng</Label>
              {/* Select của Radix không phải input thuần nên set giá trị thủ công. */}
              <Select
                value={platform}
                onValueChange={(value) =>
                  setValue('platform', value as Platform, { shouldValidate: true })
                }
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Chọn nền tảng" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-xs text-destructive">{errors.platform.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Thời gian đăng</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register('scheduledAt')}
              />
              {errors.scheduledAt && (
                <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Huỷ
          </Button>
          <Button type="submit" form="post-form" loading={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo bài đăng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
