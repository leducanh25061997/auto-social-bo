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
import { Input } from '@/components/ui/input'
import { applyApiFieldErrors } from '@/lib/api-error'
import {
  editFacebookAccountSchema,
  type EditFacebookAccountFormValues,
  type FacebookAccount,
} from '@/features/facebook-accounts/types/facebook-account.types'

interface EditFacebookAccountDialogProps {
  account: FacebookAccount | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  /** Ném lỗi khi thất bại để form map vào ô input. */
  onSubmit: (values: EditFacebookAccountFormValues) => Promise<void>
}

/** Dialog đổi tên hiển thị của tài khoản Facebook (RHF + Zod). */
export const EditFacebookAccountDialog = ({
  account,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: EditFacebookAccountDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditFacebookAccountFormValues>({
    resolver: zodResolver(editFacebookAccountSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (account) reset({ name: account.name })
  }, [account, reset])

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      applyApiFieldErrors(error, setError)
    }
  })

  return (
    <Dialog open={account !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi tên tài khoản</DialogTitle>
          <DialogDescription>
            Tên này chỉ hiển thị trong hệ thống để bạn dễ nhận biết, không ảnh hưởng
            tới Facebook.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-fb-form" className="space-y-4" onSubmit={submit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="fb-name">Tên hiển thị</Label>
            <Input id="fb-name" placeholder="vd: Fanpage Công ty" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
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
          <Button type="submit" form="edit-fb-form" loading={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
