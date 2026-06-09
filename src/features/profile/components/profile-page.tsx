import { PageHeader } from '@/components/common/page-header'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { RoleBadge } from '@/features/users/components/role-badge'
import { ProfileInfoForm } from '@/features/profile/components/profile-info-form'
import { ChangePasswordForm } from '@/features/profile/components/change-password-form'

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'U'

/** Trang Hồ sơ cá nhân — thông tin, sửa hồ sơ, đổi mật khẩu. */
const ProfilePage = () => {
  const { user } = useAuth()
  const displayName = user?.name ?? user?.username ?? 'Người dùng'

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Hồ sơ" description="Quản lý thông tin tài khoản và bảo mật của bạn." />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 text-lg">
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-semibold">{displayName}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>@{user?.username}</span>
              {user && <RoleBadge role={user.role} />}
            </div>
          </div>
        </div>

        <ProfileInfoForm />
        <ChangePasswordForm />
      </div>
    </div>
  )
}

export default ProfilePage
