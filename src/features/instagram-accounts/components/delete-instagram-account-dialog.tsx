import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { InstagramAccount } from '@/features/instagram-accounts/types/instagram-account.types'

interface DeleteInstagramAccountDialogProps {
  account: InstagramAccount | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

/** Xác nhận xoá tài khoản Instagram — hành động không thể hoàn tác. */
export const DeleteInstagramAccountDialog = ({
  account,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteInstagramAccountDialogProps) => (
  <Dialog open={account !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xoá tài khoản Instagram?</DialogTitle>
        <DialogDescription>
          Tài khoản{' '}
          <span className="font-medium text-foreground">@{account?.username}</span> sẽ bị
          gỡ khỏi hệ thống. Bạn có thể kết nối lại bất cứ lúc nào.
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
