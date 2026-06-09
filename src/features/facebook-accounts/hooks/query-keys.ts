import type { FacebookAccountListParams } from '@/features/facebook-accounts/types/facebook-account.types'

/** Query key factory — tập trung hoá để invalidate nhất quán. */
export const facebookAccountKeys = {
  all: ['facebook-accounts'] as const,
  lists: () => [...facebookAccountKeys.all, 'list'] as const,
  list: (params: FacebookAccountListParams) =>
    [...facebookAccountKeys.lists(), params] as const,
  pages: (id: string) => [...facebookAccountKeys.all, 'pages', id] as const,
}
