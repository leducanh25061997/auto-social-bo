import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Post } from '@/features/posts/types/post.types'

interface DeletePostDialogProps {
  post: Post | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

/** Hộp thoại xác nhận xoá — luôn confirm hành động khó hồi phục. */
export const DeletePostDialog = ({
  post,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeletePostDialogProps) => (
  <Dialog open={post !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xoá bài đăng?</DialogTitle>
        <DialogDescription>
          Hành động này không thể hoàn tác. Bài đăng sẽ bị xoá vĩnh viễn.
        </DialogDescription>
      </DialogHeader>
      {post && (
        <p className="line-clamp-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          {post.content}
        </p>
      )}
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Huỷ
        </Button>
        <Button variant="destructive" onClick={onConfirm} loading={isDeleting}>
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
