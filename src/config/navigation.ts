import {
  LayoutDashboard,
  Send,
  Share2,
  Facebook,
  FileText,
  Instagram,
  UsersRound,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  to: string
  icon: LucideIcon
  /** `true` nếu chỉ active khi khớp chính xác (dùng cho route index). */
  end?: boolean
  /** `true` nếu chỉ hiển thị cho ADMIN. */
  adminOnly?: boolean
}

/** Cấu hình điều hướng tập trung — thêm route mới chỉ cần khai báo ở đây. */
export const NAV_ITEMS: NavItem[] = [
  { title: 'Tổng quan', to: '/', icon: LayoutDashboard, end: true },
  { title: 'Bài đăng', to: '/posts', icon: Send },
  { title: 'Tài khoản Facebook', to: '/facebook-accounts', icon: Facebook },
  { title: 'Bài đăng Facebook', to: '/facebook-posts', icon: FileText },
  { title: 'Tài khoản Instagram', to: '/instagram-accounts', icon: Instagram },
  { title: 'Kênh kết nối', to: '/accounts', icon: Share2 },
  { title: 'Người dùng', to: '/users', icon: UsersRound, adminOnly: true },
  { title: 'Cài đặt', to: '/settings', icon: Settings },
]
