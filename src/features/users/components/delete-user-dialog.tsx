import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { User } from '@/features/users/types/user.types'

interface DeleteUserDialogProps {
  user: User | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

/** Xác nhận xoá người dùng — hành động không thể hoàn tác. */
export const DeleteUserDialog = ({
  user,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteUserDialogProps) => (
  <Dialog open={user !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xoá người dùng?</DialogTitle>
        <DialogDescription>
          Hành động này không thể hoàn tác. Tài khoản{' '}
          <span className="font-medium text-foreground">{user?.username}</span> và mọi phiên
          đăng nhập của họ sẽ bị xoá vĩnh viễn.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
          Huỷ
        </Button>
        <Button variant="destructive" onClick={onConfirm} loading={isDeleting}>
          {isDeleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
