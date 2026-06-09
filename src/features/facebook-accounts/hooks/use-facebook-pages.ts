import { useQuery } from '@tanstack/react-query'

import { getFacebookPages } from '@/features/facebook-accounts/api/facebook-accounts.api'
import { facebookAccountKeys } from '@/features/facebook-accounts/hooks/query-keys'

/**
 * Danh sách Page của 1 tài khoản. Chỉ chạy khi `accountId` có giá trị
 * (mở dialog xem Page). Không tự refetch để tránh gọi Graph API thừa.
 */
export const useGetFacebookPages = (accountId: string | null) =>
  useQuery({
    queryKey: facebookAccountKeys.pages(accountId ?? ''),
    queryFn: () => getFacebookPages(accountId as string),
    enabled: accountId !== null,
    staleTime: 60_000,
    retry: false,
  })
