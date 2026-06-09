import { useCallback, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { DEFAULT_PAGE_SIZE } from '@/components/common/data-table'
import { isInstagramConfigured } from '@/features/instagram-accounts/config'
import { useGetInstagramAccounts } from '@/features/instagram-accounts/hooks/use-instagram-accounts'
import { useInstagramAccountMutations } from '@/features/instagram-accounts/hooks/use-instagram-account-mutations'
import type {
  EditInstagramAccountFormValues,
  InstagramAccount,
  InstagramAccountListParams,
} from '@/features/instagram-accounts/types/instagram-account.types'

type StatusFilter = 'active' | 'inactive' | 'all'

/** Điều phối toàn bộ logic trang Tài khoản Instagram (tách khỏi View). */
export const useInstagramAccountsPage = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const debouncedSearch = useDebouncedValue(search, 300)

  const params = useMemo<InstagramAccountListParams>(
    () => ({ page, limit, search: debouncedSearch, status }),
    [page, limit, debouncedSearch, status],
  )

  const { data, isLoading, isError, refetch } = useGetInstagramAccounts(params)
  const { updateMutation, deleteMutation, refreshMutation } =
    useInstagramAccountMutations()

  const [editingAccount, setEditingAccount] = useState<InstagramAccount | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<InstagramAccount | null>(null)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatus(value)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setLimit(size)
    setPage(1)
  }, [])

  const handleEditSubmit = useCallback(
    async (values: EditInstagramAccountFormValues) => {
      if (!editingAccount) return
      await updateMutation.mutateAsync({
        id: editingAccount.id,
        payload: { name: values.name },
      })
      setEditingAccount(null)
    },
    [editingAccount, updateMutation],
  )

  const handleToggleActive = useCallback(
    (account: InstagramAccount) => {
      updateMutation.mutate({
        id: account.id,
        payload: { isActive: !account.isActive },
      })
    },
    [updateMutation],
  )

  const handleRefresh = useCallback(
    (account: InstagramAccount) => {
      refreshMutation.mutate(account.id)
    },
    [refreshMutation],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deletingAccount) return
    deleteMutation.mutate(deletingAccount.id, {
      onSuccess: () => setDeletingAccount(null),
    })
  }, [deletingAccount, deleteMutation])

  return {
    accounts: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    refetch,
    isConfigured: isInstagramConfigured,
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
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleEditSubmit,
    handleToggleActive,
    handleRefresh,
    handleConfirmDelete,
  }
}
