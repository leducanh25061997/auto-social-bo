import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SettingsPage = () => {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Cài đặt" description="Tuỳ chỉnh ứng dụng theo nhu cầu của bạn." />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiBase">Base URL</Label>
              <Input
                id="apiBase"
                defaultValue={import.meta.env.VITE_API_BASE_URL ?? ''}
                placeholder="https://api.example.com"
              />
              <p className="text-xs text-muted-foreground">
                Đọc từ biến môi trường <code>VITE_API_BASE_URL</code>.
              </p>
            </div>
            <Button size="sm">Lưu cấu hình</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
