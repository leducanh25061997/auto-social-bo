import { useCallback, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { DEFAULT_PAGE_SIZE } from '@/components/common/data-table'
import { isFacebookConfigured } from '@/features/facebook-accounts/config'
import { useGetFacebookAccounts } from '@/features/facebook-accounts/hooks/use-facebook-accounts'
import { useFacebookAccountMutations } from '@/features/facebook-accounts/hooks/use-facebook-account-mutations'
import type {
  EditFacebookAccountFormValues,
  FacebookAccount,
  FacebookAccountListParams,
} from '@/features/facebook-accounts/types/facebook-account.types'

type StatusFilter = 'active' | 'inactive' | 'all'

/**
 * Điều phối toàn bộ logic trang Tài khoản Facebook (tách khỏi View).
 * Phân trang SERVER-SIDE: `page` 1-based theo backend.
 */
export const useFacebookAccountsPage = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const debouncedSearch = useDebouncedValue(search, 300)

  const params = useMemo<FacebookAccountListParams>(
    () => ({ page, limit, search: debouncedSearch, status }),
    [page, limit, debouncedSearch, status],
  )

  const { data, isLoading, isError, refetch } = useGetFacebookAccounts(params)
  const { updateMutation, deleteMutation, refreshMutation } =
    useFacebookAccountMutations()

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [editingAccount, setEditingAccount] = useState<FacebookAccount | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<FacebookAccount | null>(null)
  const [pagesAccount, setPagesAccount] = useState<FacebookAccount | null>(null)

  // ── Filter handlers (reset về trang 1 khi đổi điều kiện) ──────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatus(value)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1) // DataTable 0-based -> backend 1-based
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setLimit(size)
    setPage(1)
  }, [])

  // ── Sửa tên ───────────────────────────────────────────────────────────────
  const handleEditSubmit = useCallback(
    async (values: EditFacebookAccountFormValues) => {
      if (!editingAccount) return
      await updateMutation.mutateAsync({
        id: editingAccount.id,
        payload: { name: values.name },
      })
      setEditingAccount(null)
    },
    [editingAccount, updateMutation],
  )

  // ── Bật/Tạm dừng ──────────────────────────────────────────────────────────
  const handleToggleActive = useCallback(
    (account: FacebookAccount) => {
      updateMutation.mutate({
        id: account.id,
        payload: { isActive: !account.isActive },
      })
    },
    [updateMutation],
  )

  // ── Gia hạn token ─────────────────────────────────────────────────────────
  const handleRefresh = useCallback(
    (account: FacebookAccount) => {
      refreshMutation.mutate(account.id)
    },
    [refreshMutation],
  )

  // ── Xoá ───────────────────────────────────────────────────────────────────
  const handleConfirmDelete = useCallback(() => {
    if (!deletingAccount) return
    deleteMutation.mutate(deletingAccount.id, {
      onSuccess: () => setDeletingAccount(null),
    })
  }, [deletingAccount, deleteMutation])

  return {
    // data
    accounts: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    refetch,
    isConfigured: isFacebookConfigured,
    // filters / pagination
    page,
    limit,
    search,
    status,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    // dialog state
    editingAccount,
    setEditingAccount,
    deletingAccount,
    setDeletingAccount,
    pagesAccount,
    setPagesAccount,
    // actions
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleEditSubmit,
    handleToggleActive,
    handleRefresh,
    handleConfirmDelete,
  }
}
