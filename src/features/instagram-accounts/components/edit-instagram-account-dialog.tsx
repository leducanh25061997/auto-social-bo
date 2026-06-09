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
  editInstagramAccountSchema,
  type EditInstagramAccountFormValues,
  type InstagramAccount,
} from '@/features/instagram-accounts/types/instagram-account.types'

interface EditInstagramAccountDialogProps {
  account: InstagramAccount | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: EditInstagramAccountFormValues) => Promise<void>
}

/** Dialog đổi tên hiển thị của tài khoản Instagram (RHF + Zod). */
export const EditInstagramAccountDialog = ({
  account,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: EditInstagramAccountDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditInstagramAccountFormValues>({
    resolver: zodResolver(editInstagramAccountSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (account) reset({ name: account.name ?? account.username })
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
            tới Instagram.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-ig-form" className="space-y-4" onSubmit={submit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="ig-name">Tên hiển thị</Label>
            <Input id="ig-name" placeholder="vd: IG Thương hiệu" {...register('name')} />
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
          <Button type="submit" form="edit-ig-form" loading={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
