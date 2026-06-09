import { Plus, RotateCw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppAlert } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/common/page-header'
import { useUsersPage } from '@/features/users/hooks/use-users-page'
import { UsersTable } from '@/features/users/components/users-table'
import { UserFormDialog } from '@/features/users/components/user-form-dialog'
import { DeleteUserDialog } from '@/features/users/components/delete-user-dialog'
import { ResetPasswordDialog } from '@/features/users/components/reset-password-dialog'
import { USER_ROLES, type UserRole } from '@/features/users/types/user.types'
import { ROLE_LABELS } from '@/features/users/utils/user.utils'

/** Trang Quản trị người dùng (ADMIN) — View thuần, logic ở `useUsersPage`. */
const UsersPage = () => {
  const {
    users,
    total,
    isLoading,
    isError,
    refetch,
    currentUserId,
    page,
    limit,
    search,
    role,
    handleSearchChange,
    handleRoleChange,
    handlePageChange,
    handlePageSizeChange,
    formOpen,
    setFormOpen,
    editingUser,
    deletingUser,
    setDeletingUser,
    resettingUser,
    setResettingUser,
    openCreate,
    openEdit,
    isSubmitting,
    isDeleting,
    isResetting,
    handleSubmit,
    handleConfirmDelete,
    handleConfirmReset,
  } = useUsersPage()

  return (
    <div>
      <PageHeader
        title="Quản trị người dùng"
        description="Quản lý tài khoản, phân quyền và bảo mật người dùng."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo người dùng
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm theo tên đăng nhập, họ tên, email..."
              className="pl-8"
            />
          </div>
          <Select
            value={role}
            onValueChange={(value) => handleRoleChange(value as UserRole | 'all')}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {USER_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isError ? (
          <AppAlert variant="destructive" title="Không tải được danh sách người dùng">
            <div className="flex items-center justify-between gap-3">
              <span>Đã có lỗi khi tải dữ liệu. Vui lòng thử lại.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCw className="size-4" />
                Thử lại
              </Button>
            </div>
          </AppAlert>
        ) : (
          <UsersTable
            users={users}
            total={total}
            isLoading={isLoading}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            currentUserId={currentUserId}
            onEdit={openEdit}
            onResetPassword={setResettingUser}
            onDelete={setDeletingUser}
          />
        )}
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <DeleteUserDialog
        user={deletingUser}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />

      <ResetPasswordDialog
        user={resettingUser}
        isResetting={isResetting}
        onOpenChange={(open) => !open && setResettingUser(null)}
        onConfirm={handleConfirmReset}
      />
    </div>
  )
}

export default UsersPage
