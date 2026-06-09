import type { UserListParams } from '@/features/users/types/user.types'

/** Query key factory — tập trung hoá để invalidate nhất quán. */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
}
