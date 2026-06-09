import { Facebook, Instagram, Linkedin, Twitter, type LucideIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AccountChannel {
  key: string
  name: string
  icon: LucideIcon
  connected: boolean
}

// Dữ liệu tĩnh minh hoạ — khi có backend sẽ thay bằng feature hook riêng.
const CHANNELS: AccountChannel[] = [
  { key: 'facebook', name: 'Facebook', icon: Facebook, connected: true },
  { key: 'twitter', name: 'Twitter / X', icon: Twitter, connected: true },
  { key: 'instagram', name: 'Instagram', icon: Instagram, connected: false },
  { key: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: false },
]

const AccountsPage = () => (
  <div>
    <PageHeader
      title="Tài khoản"
      description="Kết nối các tài khoản mạng xã hội để đăng bài tự động."
    />

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHANNELS.map((channel) => (
        <Card key={channel.key} className="hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <channel.icon className="size-6 text-primary" />
              <CardTitle className="text-base">{channel.name}</CardTitle>
            </div>
            <Badge variant={channel.connected ? 'success' : 'secondary'}>
              {channel.connected ? 'Đã kết nối' : 'Chưa kết nối'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              {channel.connected
                ? 'Sẵn sàng để lên lịch và đăng bài.'
                : 'Kết nối để bắt đầu đăng bài tự động.'}
            </CardDescription>
            <Button
              variant={channel.connected ? 'outline' : 'default'}
              size="sm"
              className="w-full"
            >
              {channel.connected ? 'Ngắt kết nối' : 'Kết nối'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default AccountsPage
