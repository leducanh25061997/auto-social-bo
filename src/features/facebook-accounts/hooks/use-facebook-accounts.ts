import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getFacebookAccounts } from '@/features/facebook-accounts/api/facebook-accounts.api'
import { facebookAccountKeys } from '@/features/facebook-accounts/hooks/query-keys'
import type { FacebookAccountListParams } from '@/features/facebook-accounts/types/facebook-account.types'

/**
 * Danh sách tài khoản Facebook (server-side pagination).
 * `keepPreviousData` để bảng không nhấp nháy khi đổi trang/lọc.
 */
export const useGetFacebookAccounts = (params: FacebookAccountListParams) =>
  useQuery({
    queryKey: facebookAccountKeys.list(params),
    queryFn: () => getFacebookAccounts(params),
    placeholderData: keepPreviousData,
  })
