import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getUsers } from '@/features/users/api/users.api'
import { userKeys } from '@/features/users/hooks/query-keys'
import type { UserListParams } from '@/features/users/types/user.types'

/**
 * Danh sách user (server-side pagination).
 * `keepPreviousData` để bảng không nhấp nháy khi đổi trang/lọc.
 */
export const useGetUsers = (params: UserListParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  })
