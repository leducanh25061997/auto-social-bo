import { Loader2, RotateCw } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppAlert } from '@/components/ui/alert'
import { useGetFacebookPages } from '@/features/facebook-accounts/hooks/use-facebook-pages'
import type { FacebookAccount } from '@/features/facebook-accounts/types/facebook-account.types'

interface FacebookPagesDialogProps {
  account: FacebookAccount | null
  onOpenChange: (open: boolean) => void
}

/** Dialog hiển thị danh sách Page mà tài khoản Facebook đang quản trị. */
export const FacebookPagesDialog = ({
  account,
  onOpenChange,
}: FacebookPagesDialogProps) => {
  const { data: pages, isLoading, isError, refetch, isFetching } = useGetFacebookPages(
    account?.id ?? null,
  )

  return (
    <Dialog open={account !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Page do {account?.name} quản trị</DialogTitle>
          <DialogDescription>
            Danh sách các Fanpage mà tài khoản này có quyền quản trị trên Facebook.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Đang tải danh sách Page...
            </div>
          ) : isError ? (
            <AppAlert variant="destructive" title="Không tải được danh sách Page">
              <div className="flex items-center justify-between gap-3">
                <span>
                  Có thể kết nối Facebook đã hết hạn. Hãy thử lại hoặc kết nối lại tài
                  khoản.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  loading={isFetching}
                >
                  <RotateCw className="size-4" />
                  Thử lại
                </Button>
              </div>
            </AppAlert>
          ) : !pages || pages.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Tài khoản này hiện không quản trị Page nào.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-card p-3 transition-colors hover:bg-accent/60"
                >
                  <Avatar className="size-10">
                    {page.picture && <AvatarImage src={page.picture} alt={page.name} />}
                    <AvatarFallback>{page.name[0]?.toUpperCase() ?? 'P'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{page.name}</div>
                    {page.category && (
                      <Badge variant="secondary" className="mt-1">
                        {page.category}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
