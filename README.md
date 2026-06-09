# Auto Social Bot — Admin Dashboard

Ứng dụng web (SPA) quản lý & tự động hoá đăng bài mạng xã hội. Xây dựng theo kiến trúc **Feature-Sliced Design** với React 18 + Vite + TypeScript (strict).

## Tech Stack

| Lớp | Công nghệ |
| --- | --- |
| Framework | React 18 + Vite (CSR SPA) |
| Ngôn ngữ | TypeScript (strict mode, không `any`) |
| Styling | Tailwind CSS + `cn()` helper |
| UI | Shadcn UI (Radix UI) |
| Server state | TanStack Query (React Query) |
| Client state | Zustand (persist) |
| Routing | React Router v6 (`createBrowserRouter`) + lazy load |
| Form | React Hook Form + Zod |

## Bắt đầu

```bash
npm install
cp .env.example .env   # cấu hình VITE_API_BASE_URL (tuỳ chọn)
npm run dev            # chạy dev server tại http://localhost:5173
```

Các lệnh khác:

```bash
npm run build       # type-check + build production
npm run preview     # xem thử bản build
npm run typecheck   # chỉ kiểm tra type
npm run lint        # ESLint
```

> Hiện tầng API đang dùng **mock in-memory** (`src/features/posts/api/posts.api.ts`)
> để app chạy được mà không cần backend. Khi có API thật, chỉ cần thay thân hàm
> bằng `apiClient` — chữ ký hàm giữ nguyên nên tầng hook/UI không phải sửa.

## Cấu trúc thư mục (Feature-Sliced Design)

```
src/
├── components/
│   ├── ui/              # Component dùng chung của Shadcn UI (Button, Table, Dialog...)
│   ├── layout/          # App shell: Sidebar, Header, AppLayout
│   └── common/          # PageHeader, PageLoader, RouteError, NotFound
├── config/              # Cấu hình tập trung (navigation...)
├── features/            # Mỗi tính năng là một module độc lập
│   └── <feature>/
│       ├── api/         # Hàm gọi API riêng của feature
│       ├── components/  # Component UI riêng của feature (gồm <feature>-page.tsx)
│       ├── hooks/       # Custom hooks (React Query, logic trang)
│       ├── types/       # Type + Zod schema
│       └── utils/       # Helper riêng của feature
├── hooks/               # Hook dùng chung (use-toast, use-debounced-value)
├── lib/                 # utils (cn), api-client, query-client
├── routes/              # Định nghĩa router (createBrowserRouter)
├── stores/              # Zustand stores (client state)
└── main.tsx             # Entry: Providers + RouterProvider
```

### Feature tham chiếu: `posts`

Module `features/posts` minh hoạ đầy đủ chuẩn dự án:

- `types/post.types.ts` — Zod schema là **single source of truth** cho cả validate runtime lẫn type tĩnh.
- `api/posts.api.ts` — tách biệt lời gọi dữ liệu.
- `hooks/` — `useGetPosts` (query), `usePostMutations` (create/update/delete + toast + invalidate), `usePostsPage` (gom toàn bộ logic trang, tách khỏi View).
- `components/` — `posts-page.tsx` (View thuần), `posts-table.tsx` (data table với `memo`), `post-form-dialog.tsx` (RHF + Zod), filters, dialogs.

## Quy ước code

- Functional component (arrow function); tách **logic (hook)** khỏi **UI (view)**.
- Không inline CSS — luôn dùng `cn()` để merge class Tailwind.
- `React.memo` / `useMemo` / `useCallback` có chủ đích cho dữ liệu lớn (data table).
- Lazy load route bằng `React.lazy()` + `Suspense` để code splitting.
- Ưu tiên import từ `@/components/ui` trước khi tự viết component mới.
- Path alias `@` → `src`.
```
