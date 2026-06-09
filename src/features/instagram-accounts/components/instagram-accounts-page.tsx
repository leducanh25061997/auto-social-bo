import { Link } from 'react-router-dom'
import { Instagram, RotateCw, Search } from 'lucide-react'

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
import { useInstagramAccountsPage } from '@/features/instagram-accounts/hooks/use-instagram-accounts-page'
import { InstagramAccountsTable } from '@/features/instagram-accounts/components/instagram-accounts-table'
import { EditInstagramAccountDialog } from '@/features/instagram-accounts/components/edit-instagram-account-dialog'
import { DeleteInstagramAccountDialog } from '@/features/instagram-accounts/components/delete-instagram-account-dialog'

/** Trang Tài khoản Instagram — View thuần, logic ở `useInstagramAccountsPage`. */
const InstagramAccountsPage = () => {
  const {
    accounts,
    total,
    isLoading,
    isError,
    refetch,
    isConfigured,
    page,
    limit,
    search,
    status,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    editingAccount,
    setEditingAccount,
    deletingAccount,
    setDeletingAccount,
    isSubmitting,
    isDeleting,
    handleEditSubmit,
    handleToggleActive,
    handleRefresh,
    handleConfirmDelete,
  } = useInstagramAccountsPage()

  return (
    <div>
      <PageHeader
        title="Tài khoản Instagram"
        description="Kết nối và quản lý các tài khoản Instagram để đăng bài tự động."
        actions={
          <Button asChild>
            <Link to="/instagram-accounts/connect">
              <Instagram className="size-4" />
              Kết nối Instagram
            </Link>
          </Button>
        }
      />

      {!isConfigured && (
        <AppAlert variant="warning" title="Chưa cấu hình kết nối Instagram" className="mb-4">
          Tính năng đăng nhập Instagram chưa được bật. Vui lòng liên hệ quản trị viên để
          cấu hình.
        </AppAlert>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm theo username hoặc tên..."
              className="pl-8"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) =>
              handleStatusChange(value as 'active' | 'inactive' | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isError ? (
          <AppAlert variant="destructive" title="Không tải được danh sách tài khoản">
            <div className="flex items-center justify-between gap-3">
              <span>Đã có lỗi khi tải dữ liệu. Vui lòng thử lại.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCw className="size-4" />
                Thử lại
              </Button>
            </div>
          </AppAlert>
        ) : (
          <InstagramAccountsTable
            accounts={accounts}
            total={total}
            isLoading={isLoading}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={setEditingAccount}
            onToggleActive={handleToggleActive}
            onRefresh={handleRefresh}
            onDelete={setDeletingAccount}
          />
        )}
      </div>

      <EditInstagramAccountDialog
        account={editingAccount}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => !open && setEditingAccount(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteInstagramAccountDialog
        account={deletingAccount}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default InstagramAccountsPage
