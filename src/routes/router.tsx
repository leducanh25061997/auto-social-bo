import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/components/layout/app-layout'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'
import { RouteError } from '@/components/common/route-error'
import { NotFoundPage } from '@/components/common/not-found-page'
import { PageLoader } from '@/components/common/page-loader'

/*
 * Lazy load từng page để Vite tách code (code splitting) theo route.
 * <Outlet/> trong AppLayout đã được bọc <Suspense> nên fallback hoạt động tự động.
 * React.lazy yêu cầu module có default export.
 */
const LoginPage = lazy(() => import('@/features/auth/components/login-page'))
const DashboardPage = lazy(() => import('@/features/dashboard/components/dashboard-page'))
const PostsPage = lazy(() => import('@/features/posts/components/posts-page'))
const AccountsPage = lazy(() => import('@/features/accounts/components/accounts-page'))
const FacebookAccountsPage = lazy(
  () => import('@/features/facebook-accounts/components/facebook-accounts-page'),
)
const FacebookConnectPage = lazy(
  () => import('@/features/facebook-accounts/components/facebook-connect-page'),
)
const FacebookOAuthCallback = lazy(
  () => import('@/features/facebook-accounts/components/facebook-oauth-callback'),
)
const FacebookPostsPage = lazy(
  () => import('@/features/facebook-posts/components/facebook-posts-page'),
)
const FacebookPostComposerPage = lazy(
  () => import('@/features/facebook-posts/components/facebook-post-composer-page'),
)
const InstagramAccountsPage = lazy(
  () => import('@/features/instagram-accounts/components/instagram-accounts-page'),
)
const InstagramConnectPage = lazy(
  () => import('@/features/instagram-accounts/components/instagram-connect-page'),
)
const InstagramOAuthCallback = lazy(
  () => import('@/features/instagram-accounts/components/instagram-oauth-callback'),
)
const SettingsPage = lazy(() => import('@/features/settings/components/settings-page'))
const ProfilePage = lazy(() => import('@/features/profile/components/profile-page'))
const UsersPage = lazy(() => import('@/features/users/components/users-page'))

export const router = createBrowserRouter([
  // Route công khai (không cần đăng nhập). Bọc Suspense vì LoginPage là lazy.
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },

  // Trang callback OAuth Facebook — mở trong pop-up, KHÔNG yêu cầu đăng nhập.
  {
    path: '/oauth/facebook/callback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <FacebookOAuthCallback />
      </Suspense>
    ),
  },

  // Trang callback OAuth Instagram — mở trong pop-up, KHÔNG yêu cầu đăng nhập.
  {
    path: '/oauth/instagram/callback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <InstagramOAuthCallback />
      </Suspense>
    ),
  },

  // Mọi route bên dưới đều được RequireAuth bảo vệ.
  {
    element: <RequireAuth />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'posts', element: <PostsPage /> },
          { path: 'accounts', element: <AccountsPage /> },
          { path: 'facebook-accounts', element: <FacebookAccountsPage /> },
          { path: 'facebook-accounts/connect', element: <FacebookConnectPage /> },
          { path: 'facebook-posts', element: <FacebookPostsPage /> },
          { path: 'facebook-posts/create', element: <FacebookPostComposerPage /> },
          { path: 'facebook-posts/:id/edit', element: <FacebookPostComposerPage /> },
          { path: 'instagram-accounts', element: <InstagramAccountsPage /> },
          { path: 'instagram-accounts/connect', element: <InstagramConnectPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
          // Quản trị người dùng — chỉ ADMIN.
          {
            element: <RequireRole roles={['ADMIN']} />,
            children: [{ path: 'users', element: <UsersPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
