import { Plus, RotateCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/ui/alert'
import { PageHeader } from '@/components/common/page-header'
import { usePostsPage } from '@/features/posts/hooks/use-posts-page'
import { PostsFilters } from '@/features/posts/components/posts-filters'
import { PostsTable } from '@/features/posts/components/posts-table'
import { PostFormDialog } from '@/features/posts/components/post-form-dialog'
import { DeletePostDialog } from '@/features/posts/components/delete-post-dialog'

/**
 * Trang quản lý bài đăng — tầng View thuần tuý: chỉ ghép các component và nhận
 * state/handler từ `usePostsPage`. Mọi logic nằm trong hook.
 */
const PostsPage = () => {
  const {
    posts,
    isLoading,
    isFetching,
    isError,
    refetch,
    filters,
    formOpen,
    setFormOpen,
    editingPost,
    deletingPost,
    setDeletingPost,
    isSubmitting,
    isDeleting,
    handleFilterChange,
    openCreate,
    openEdit,
    openDelete,
    handleSubmit,
    handleConfirmDelete,
  } = usePostsPage()

  return (
    <div>
      <PageHeader
        title="Bài đăng"
        description="Quản lý và lên lịch các bài đăng tự động trên mạng xã hội."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo bài đăng
          </Button>
        }
      />

      <div className="space-y-4">
        <PostsFilters
          filters={filters}
          onChange={handleFilterChange}
          isFetching={isFetching && !isLoading}
        />

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
          <PostsTable
            posts={posts}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      <PostFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editingPost}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <DeletePostDialog
        post={deletingPost}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeletingPost(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default PostsPage
