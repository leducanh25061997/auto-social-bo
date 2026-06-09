import type { InstagramAccountListParams } from '@/features/instagram-accounts/types/instagram-account.types'

/** Query key factory — tập trung hoá để invalidate nhất quán. */
export const instagramAccountKeys = {
  all: ['instagram-accounts'] as const,
  lists: () => [...instagramAccountKeys.all, 'list'] as const,
  list: (params: InstagramAccountListParams) =>
    [...instagramAccountKeys.lists(), params] as const,
}
