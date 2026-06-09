import { useCallback, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { DEFAULT_PAGE_SIZE } from '@/components/common/data-table'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useGetUsers } from '@/features/users/hooks/use-users'
import { useUserMutations } from '@/features/users/hooks/use-user-mutations'
import type {
  CreateUserFormValues,
  UpdateUserFormValues,
  User,
  UserListParams,
  UserRole,
} from '@/features/users/types/user.types'

type RoleFilter = UserRole | 'all'

/**
 * Điều phối toàn bộ logic trang Quản trị người dùng (tách khỏi View).
 * Phân trang SERVER-SIDE: `page` 1-based theo backend.
 */
export const useUsersPage = () => {
  const { user: currentUser } = useAuth()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')

  const debouncedSearch = useDebouncedValue(search, 300)

  const params = useMemo<UserListParams>(
    () => ({ page, limit, search: debouncedSearch, role }),
    [page, limit, debouncedSearch, role],
  )

  const { data, isLoading, isError, refetch } = useGetUsers(params)
  const { createMutation, updateMutation, deleteMutation, resetPasswordMutation } =
    useUserMutations()

  // ── Dialog state ────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [resettingUser, setResettingUser] = useState<User | null>(null)

  // ── Filter handlers (reset về trang 1 khi đổi điều kiện lọc) ──────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleRoleChange = useCallback((value: RoleFilter) => {
    setRole(value)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1) // DataTable 0-based -> backend 1-based
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setLimit(size)
    setPage(1)
  }, [])

  // ── Open dialogs ──────────────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setEditingUser(undefined)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((u: User) => {
    setEditingUser(u)
    setFormOpen(true)
  }, [])

  // ── Submit handlers ───────────────────────────────────────────────────────
  // Dùng mutateAsync + rethrow để dialog bắt lỗi và map vào từng ô input.
  // Đóng dialog CHỈ khi thành công; lỗi sẽ ném ra cho form xử lý.
  const handleSubmit = useCallback(
    async (values: CreateUserFormValues | UpdateUserFormValues) => {
      if (editingUser) {
        const v = values as UpdateUserFormValues
        await updateMutation.mutateAsync({
          id: editingUser.id,
          payload: { name: v.name || null, email: v.email || null, role: v.role },
        })
      } else {
        const v = values as CreateUserFormValues
        await createMutation.mutateAsync({
          username: v.username,
          password: v.password,
          role: v.role,
          name: v.name || undefined,
          email: v.email || undefined,
        })
      }
      setFormOpen(false)
    },
    [editingUser, createMutation, updateMutation],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deletingUser) return
    deleteMutation.mutate(deletingUser.id, { onSuccess: () => setDeletingUser(null) })
  }, [deletingUser, deleteMutation])

  const handleConfirmReset = useCallback(
    (password: string) => {
      if (!resettingUser) return
      resetPasswordMutation.mutate(
        { id: resettingUser.id, password },
        { onSuccess: () => setResettingUser(null) },
      )
    },
    [resettingUser, resetPasswordMutation],
  )

  return {
    // data
    users: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    refetch,
    currentUserId: currentUser?.id,
    // filters / pagination
    page,
    limit,
    search,
    role,
    handleSearchChange,
    handleRoleChange,
    handlePageChange,
    handlePageSizeChange,
    // dialog state
    formOpen,
    setFormOpen,
    editingUser,
    deletingUser,
    setDeletingUser,
    resettingUser,
    setResettingUser,
    openCreate,
    openEdit,
    // submit
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isResetting: resetPasswordMutation.isPending,
    handleSubmit,
    handleConfirmDelete,
    handleConfirmReset,
  }
}
