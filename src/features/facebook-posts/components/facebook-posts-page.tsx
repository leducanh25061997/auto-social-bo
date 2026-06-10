import { Link, useNavigate } from 'react-router-dom'
import { Plus, RotateCw, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
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
import { useFacebookPostsPage } from '@/features/facebook-posts/hooks/use-facebook-posts-page'
import { FacebookPostsTable } from '@/features/facebook-posts/components/facebook-posts-table'
import { DeleteFacebookPostDialog } from '@/features/facebook-posts/components/delete-facebook-post-dialog'
import { RescheduleFacebookPostDialog } from '@/features/facebook-posts/components/reschedule-facebook-post-dialog'
import { POST_STATUS_TABS } from '@/features/facebook-posts/utils/post.utils'
import type { FacebookPostStatus } from '@/features/facebook-posts/types/facebook-post.types'

/** Trang Bài đăng Facebook — View thuần, logic ở `useFacebookPostsPage`. */
const FacebookPostsPage = () => {
  const navigate = useNavigate()
  const {
    posts,
    total,
    isLoading,
    isError,
    refetch,
    isConfigured,
    accounts,
    page,
    limit,
    search,
    status,
    accountId,
    handleSearchChange,
    handleStatusChange,
    handleAccountChange,
    handlePageChange,
    handlePageSizeChange,
    handlePublish,
    handleCancelSchedule,
    deletingPost,
    setDeletingPost,
    reschedulingPost,
    setReschedulingPost,
    handleConfirmDelete,
    handleConfirmReschedule,
    isDeleting,
    isRescheduling,
  } = useFacebookPostsPage()

  return (
    <div>
      <PageHeader
        title="Bài đăng Facebook"
        description="Soạn, xem trước và đăng bài lên các Page Facebook đã kết nối."
        actions={
          <Button asChild>
            <Link to="/facebook-posts/create">
              <Plus className="size-4" />
              Tạo bài đăng
            </Link>
          </Button>
        }
      />

      {!isConfigured && (
        <AppAlert variant="warning" title="Chưa cấu hình kết nối Facebook" className="mb-4">
          Tính năng đăng bài Facebook chưa được bật. Vui lòng liên hệ quản trị viên để cấu hình.
        </AppAlert>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm theo nội dung hoặc tên Page..."
              className="pl-8"
            />
          </div>
          <Select value={accountId || 'all'} onValueChange={(v) => handleAccountChange(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Tất cả tài khoản" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tài khoản</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(v) => handleStatusChange(v as FacebookPostStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {POST_STATUS_TABS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tab lọc nhanh theo trạng thái */}
        <div className="flex flex-wrap gap-2">
          {POST_STATUS_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleStatusChange(t.value)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                status === t.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isError ? (
          <AppAlert variant="destructive" title="Không tải được danh sách bài đăng">
            <div className="flex items-center justify-between gap-3">
              <span>Đã có lỗi khi tải dữ liệu. Vui lòng thử lại.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCw className="size-4" />
                Thử lại
              </Button>
            </div>
          </AppAlert>
        ) : (
          <FacebookPostsTable
            posts={posts}
            total={total}
            isLoading={isLoading}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(p) => navigate(`/facebook-posts/${p.id}/edit`)}
            onPublish={handlePublish}
            onReschedule={setReschedulingPost}
            onCancelSchedule={handleCancelSchedule}
            onDelete={setDeletingPost}
          />
        )}
      </div>

      <DeleteFacebookPostDialog
        post={deletingPost}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeletingPost(null)}
        onConfirm={handleConfirmDelete}
      />

      <RescheduleFacebookPostDialog
        post={reschedulingPost}
        isSubmitting={isRescheduling}
        onOpenChange={(open) => !open && setReschedulingPost(null)}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  )
}

export default FacebookPostsPage
