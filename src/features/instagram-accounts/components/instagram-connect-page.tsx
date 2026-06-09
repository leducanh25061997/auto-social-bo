import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Instagram } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { notify } from '@/lib/notify'
import { useInstagramAccountMutations } from '@/features/instagram-accounts/hooks/use-instagram-account-mutations'
import {
  InstagramOAuthCancelled,
  useInstagramOAuth,
} from '@/features/instagram-accounts/hooks/use-instagram-oauth'
import type { InstagramConnectPreview } from '@/features/instagram-accounts/types/instagram-account.types'

/**
 * Trang kết nối Instagram — luồng 2 bước:
 *  1. Đăng nhập Instagram (pop-up) -> backend trả hồ sơ xem trước.
 *  2. Người dùng xem hồ sơ, đặt tên hiển thị rồi bấm "Tạo tài khoản".
 */
const InstagramConnectPage = () => {
  const navigate = useNavigate()
  const { login, isConfigured } = useInstagramOAuth()
  const { exchangeMutation, connectMutation } = useInstagramAccountMutations()

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [preview, setPreview] = useState<InstagramConnectPreview | null>(null)
  const [name, setName] = useState('')

  const backToList = () => navigate('/instagram-accounts')

  const handleLogin = async () => {
    if (!isConfigured) {
      notify.warning(
        'Chưa cấu hình Instagram',
        'Vui lòng liên hệ quản trị viên để bật tính năng kết nối.',
      )
      return
    }
    setIsLoggingIn(true)
    try {
      const credentials = await login()
      const result = await exchangeMutation.mutateAsync(credentials)
      setPreview(result)
      setName(result.name ?? result.username)
    } catch (error) {
      if (error instanceof InstagramOAuthCancelled) {
        notify.info('Đã huỷ kết nối Instagram')
      } else if (error instanceof Error && !('status' in error)) {
        notify.error('Không mở được đăng nhập Instagram', error.message)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleCreate = async () => {
    if (!preview) return
    try {
      await connectMutation.mutateAsync({
        pendingId: preview.pendingId,
        name: name.trim() || undefined,
      })
      backToList()
    } catch {
      /* lỗi đã toast trong mutation */
    }
  }

  const loginPending = isLoggingIn || exchangeMutation.isPending

  return (
    <div>
      <PageHeader
        title="Kết nối Instagram"
        description="Đăng nhập Instagram và tạo tài khoản để đăng bài tự động."
        actions={
          <Button variant="outline" onClick={backToList}>
            <ArrowLeft className="size-4" />
            Quay lại
          </Button>
        }
      />

      <div className="mx-auto max-w-xl">
        {!isConfigured && (
          <AppAlert
            variant="warning"
            title="Chưa cấu hình kết nối Instagram"
            className="mb-4"
          >
            Tính năng đăng nhập Instagram chưa được bật. Vui lòng liên hệ quản trị viên để
            cấu hình App ID và Redirect URI trên Meta App.
          </AppAlert>
        )}

        {!preview ? (
          <Card className="shadow-md shadow-blue-500/10">
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Instagram className="size-6" />
              </div>
              <CardTitle>Đăng nhập tài khoản Instagram</CardTitle>
              <CardDescription>
                Bấm nút bên dưới để đăng nhập. Sau khi đăng nhập, bạn sẽ xem lại thông tin
                tài khoản trước khi tạo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={handleLogin}
                loading={loginPending}
                disabled={!isConfigured}
              >
                <Instagram className="size-4" />
                Đăng nhập Instagram
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md shadow-blue-500/10">
            <CardHeader>
              <CardTitle>Xác nhận tài khoản</CardTitle>
              <CardDescription>
                Kiểm tra thông tin và đặt tên hiển thị, sau đó bấm “Tạo tài khoản”.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <Avatar className="size-12">
                  {preview.picture && (
                    <AvatarImage src={preview.picture} alt={preview.username} />
                  )}
                  <AvatarFallback>
                    {preview.username[0]?.toUpperCase() ?? 'I'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">
                    @{preview.username}
                  </div>
                  {preview.name && (
                    <div className="truncate text-xs text-muted-foreground">
                      {preview.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ig-display-name">Tên hiển thị</Label>
                <Input
                  id="ig-display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên để bạn dễ nhận biết trong hệ thống"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  disabled={connectMutation.isPending}
                >
                  Đăng nhập tài khoản khác
                </Button>
                <Button onClick={handleCreate} loading={connectMutation.isPending}>
                  Tạo tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default InstagramConnectPage
