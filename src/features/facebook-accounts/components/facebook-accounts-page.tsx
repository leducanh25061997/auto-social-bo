import { Link } from 'react-router-dom'
import { Facebook, RotateCw, Search } from 'lucide-react'

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
import { useFacebookAccountsPage } from '@/features/facebook-accounts/hooks/use-facebook-accounts-page'
import { FacebookAccountsTable } from '@/features/facebook-accounts/components/facebook-accounts-table'
import { EditFacebookAccountDialog } from '@/features/facebook-accounts/components/edit-facebook-account-dialog'
import { DeleteFacebookAccountDialog } from '@/features/facebook-accounts/components/delete-facebook-account-dialog'
import { FacebookPagesDialog } from '@/features/facebook-accounts/components/facebook-pages-dialog'

/** Trang Tài khoản Facebook — View thuần, mọi logic ở `useFacebookAccountsPage`. */
const FacebookAccountsPage = () => {
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
    pagesAccount,
    setPagesAccount,
    isSubmitting,
    isDeleting,
    handleEditSubmit,
    handleToggleActive,
    handleRefresh,
    handleConfirmDelete,
  } = useFacebookAccountsPage()

  return (
    <div>
      <PageHeader
        title="Tài khoản Facebook"
        description="Kết nối và quản lý các tài khoản Facebook để đăng bài tự động."
        actions={
          <Button asChild>
            <Link to="/facebook-accounts/connect">
              <Facebook className="size-4" />
              Kết nối Facebook
            </Link>
          </Button>
        }
      />

      {!isConfigured && (
        <AppAlert variant="warning" title="Chưa cấu hình kết nối Facebook" className="mb-4">
          Tính năng đăng nhập Facebook chưa được bật. Vui lòng liên hệ quản trị viên để
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
              placeholder="Tìm theo tên hoặc Facebook ID..."
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
          <FacebookAccountsTable
            accounts={accounts}
            total={total}
            isLoading={isLoading}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onViewPages={setPagesAccount}
            onEdit={setEditingAccount}
            onToggleActive={handleToggleActive}
            onRefresh={handleRefresh}
            onDelete={setDeletingAccount}
          />
        )}
      </div>

      <EditFacebookAccountDialog
        account={editingAccount}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => !open && setEditingAccount(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteFacebookAccountDialog
        account={deletingAccount}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
        onConfirm={handleConfirmDelete}
      />

      <FacebookPagesDialog
        account={pagesAccount}
        onOpenChange={(open) => !open && setPagesAccount(null)}
      />
    </div>
  )
}

export default FacebookAccountsPage
