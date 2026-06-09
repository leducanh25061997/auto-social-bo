import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getInstagramAccounts } from '@/features/instagram-accounts/api/instagram-accounts.api'
import { instagramAccountKeys } from '@/features/instagram-accounts/hooks/query-keys'
import type { InstagramAccountListParams } from '@/features/instagram-accounts/types/instagram-account.types'

/** Danh sách tài khoản Instagram (server-side pagination). */
export const useGetInstagramAccounts = (params: InstagramAccountListParams) =>
  useQuery({
    queryKey: instagramAccountKeys.list(params),
    queryFn: () => getInstagramAccounts(params),
    placeholderData: keepPreviousData,
  })
