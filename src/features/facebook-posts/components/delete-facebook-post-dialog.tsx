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
import type { FacebookPost } from '@/features/facebook-posts/types/facebook-post.types'

interface DeleteFacebookPostDialogProps {
  post: FacebookPost | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (deleteOnFacebook: boolean) => void
}

/** Xác nhận xoá bài đăng. Nếu bài đã đăng → cho phép xoá luôn trên Facebook. */
export const DeleteFacebookPostDialog = ({
  post,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteFacebookPostDialogProps) => {
  const [alsoOnFacebook, setAlsoOnFacebook] = useState(false)

  // Reset lựa chọn mỗi khi mở dialog cho 1 bài khác.
  useEffect(() => {
    setAlsoOnFacebook(false)
  }, [post?.id])

  const isPublished = post?.status === 'published' && Boolean(post.postId)

  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá bài đăng?</DialogTitle>
          <DialogDescription>
            Bài đăng sẽ bị gỡ khỏi hệ thống. Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {isPublished && (
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-primary"
              checked={alsoOnFacebook}
              onChange={(e) => setAlsoOnFacebook(e.target.checked)}
            />
            <span>
              <span className="font-medium text-foreground">Xoá luôn trên Facebook</span>
              <span className="block text-muted-foreground">
                Gỡ bài viết khỏi Page. Nếu bỏ chọn, bài vẫn còn trên Facebook.
              </span>
            </span>
          </label>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(alsoOnFacebook)}
            loading={isDeleting}
          >
            {isDeleting ? 'Đang xoá...' : 'Xoá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
