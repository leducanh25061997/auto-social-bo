import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Facebook } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { notify } from '@/lib/notify'
import { useFacebookAccountMutations } from '@/features/facebook-accounts/hooks/use-facebook-account-mutations'
import {
  FacebookOAuthCancelled,
  useFacebookOAuth,
} from '@/features/facebook-accounts/hooks/use-facebook-oauth'
import type { FacebookConnectPreview } from '@/features/facebook-accounts/types/facebook-account.types'

/**
 * Trang kết nối Facebook — luồng 2 bước:
 *  1. Đăng nhập Facebook (pop-up) -> backend trả hồ sơ xem trước.
 *  2. Người dùng xem hồ sơ, đặt tên hiển thị rồi bấm "Tạo tài khoản".
 */
const FacebookConnectPage = () => {
  const navigate = useNavigate()
  const { login, isConfigured } = useFacebookOAuth()
  const { exchangeMutation, connectMutation } = useFacebookAccountMutations()

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [preview, setPreview] = useState<FacebookConnectPreview | null>(null)
  const [name, setName] = useState('')

  const backToList = () => navigate('/facebook-accounts')

  // Bước 1: đăng nhập + lấy hồ sơ xem trước.
  const handleLogin = async () => {
    if (!isConfigured) {
      notify.warning(
        'Chưa cấu hình Facebook',
        'Vui lòng liên hệ quản trị viên để bật tính năng kết nối.',
      )
      return
    }
    setIsLoggingIn(true)
    try {
      const credentials = await login()
      const result = await exchangeMutation.mutateAsync(credentials)
      setPreview(result)
      setName(result.name)
    } catch (error) {
      if (error instanceof FacebookOAuthCancelled) {
        notify.info('Đã huỷ kết nối Facebook')
      } else if (error instanceof Error && !('status' in error)) {
        notify.error('Không mở được đăng nhập Facebook', error.message)
      }
      // Lỗi API từ exchange đã được toast trong mutation.
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Bước 2: xác nhận tạo tài khoản.
  const handleCreate = async () => {
    if (!preview) return
    try {
      await connectMutation.mutateAsync({
        pendingId: preview.pendingId,
        name: name.trim() || undefined,
      })
      backToList()
    } catch {
      // Lỗi đã được toast trong mutation; giữ nguyên trang để thử lại.
    }
  }

  const loginPending = isLoggingIn || exchangeMutation.isPending

  return (
    <div>
      <PageHeader
        title="Kết nối Facebook"
        description="Đăng nhập Facebook và tạo tài khoản để đăng bài tự động."
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
            title="Chưa cấu hình kết nối Facebook"
            className="mb-4"
          >
            Tính năng đăng nhập Facebook chưa được bật. Vui lòng liên hệ quản trị viên để
            cấu hình App ID và Redirect URI trên Meta App.
          </AppAlert>
        )}

        {!preview ? (
          <Card className="shadow-md shadow-blue-500/10">
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Facebook className="size-6" />
              </div>
              <CardTitle>Đăng nhập tài khoản Facebook</CardTitle>
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
                <Facebook className="size-4" />
                Đăng nhập Facebook
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
                    <AvatarImage src={preview.picture} alt={preview.name} />
                  )}
                  <AvatarFallback>{preview.name[0]?.toUpperCase() ?? 'F'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{preview.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {preview.externalId}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fb-display-name">Tên hiển thị</Label>
                <Input
                  id="fb-display-name"
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

export default FacebookConnectPage
