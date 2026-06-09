import type {
  Post,
  PostListParams,
  PostPayload,
} from '@/features/posts/types/post.types'

/*
 * ────────────────────────────────────────────────────────────────────────────
 * MOCK API LAYER
 * ────────────────────────────────────────────────────────────────────────────
 * Hiện chưa có backend nên tầng này giả lập một "database" trong bộ nhớ + độ trễ
 * mạng để toàn bộ luồng React Query (loading / error / cache / mutation) hoạt động
 * thật. Khi có API thật, chỉ cần thay phần thân mỗi hàm bằng `apiClient`, giữ
 * nguyên chữ ký — các hook ở tầng trên không phải sửa.
 *
 * Ví dụ chuyển sang thật:
 *   export const getPosts = (params: PostListParams) =>
 *     apiClient.get<Post[]>('/posts', { params })
 * ────────────────────────────────────────────────────────────────────────────
 */

const LATENCY_MS = 500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const nowIso = () => new Date().toISOString()

const seed = (): Post[] => {
  const base = Date.now()
  const mk = (offsetH: number) => new Date(base + offsetH * 3_600_000).toISOString()
  return [
    {
      id: crypto.randomUUID(),
      content: 'Ra mắt tính năng mới của Auto Social Bot 🚀 Hãy theo dõi để cập nhật!',
      platform: 'facebook',
      status: 'scheduled',
      scheduledAt: mk(3),
      createdAt: nowIso(),
    },
    {
      id: crypto.randomUUID(),
      content: 'Mẹo tăng tương tác: đăng bài vào khung giờ vàng 19h–21h.',
      platform: 'twitter',
      status: 'published',
      scheduledAt: mk(-20),
      createdAt: nowIso(),
    },
    {
      id: crypto.randomUUID(),
      content: 'Behind the scenes của team marketing tuần này 📸',
      platform: 'instagram',
      status: 'draft',
      scheduledAt: mk(24),
      createdAt: nowIso(),
    },
    {
      id: crypto.randomUUID(),
      content: 'Chúng tôi đang tuyển Senior Frontend Engineer (React/TypeScript).',
      platform: 'linkedin',
      status: 'failed',
      scheduledAt: mk(-2),
      createdAt: nowIso(),
    },
  ]
}

// "Database" trong bộ nhớ — chỉ tồn tại trong phiên hiện tại của trình duyệt.
let db: Post[] = seed()

export const getPosts = async (params: PostListParams = {}): Promise<Post[]> => {
  await delay(LATENCY_MS)
  const { search, platform, status } = params

  return db
    .filter((p) =>
      search ? p.content.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .filter((p) => (platform && platform !== 'all' ? p.platform === platform : true))
    .filter((p) => (status && status !== 'all' ? p.status === status : true))
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
}

export const getPost = async (id: string): Promise<Post> => {
  await delay(LATENCY_MS)
  const found = db.find((p) => p.id === id)
  if (!found) throw new Error('Không tìm thấy bài đăng')
  return found
}

export const createPost = async (payload: PostPayload): Promise<Post> => {
  await delay(LATENCY_MS)
  const created: Post = {
    id: crypto.randomUUID(),
    content: payload.content,
    platform: payload.platform,
    status: 'scheduled',
    scheduledAt: new Date(payload.scheduledAt).toISOString(),
    createdAt: nowIso(),
  }
  db = [created, ...db]
  return created
}

export const updatePost = async (id: string, payload: PostPayload): Promise<Post> => {
  await delay(LATENCY_MS)
  let updated: Post | undefined
  db = db.map((p) => {
    if (p.id !== id) return p
    updated = {
      ...p,
      content: payload.content,
      platform: payload.platform,
      scheduledAt: new Date(payload.scheduledAt).toISOString(),
    }
    return updated
  })
  if (!updated) throw new Error('Không tìm thấy bài đăng để cập nhật')
  return updated
}

export const deletePost = async (id: string): Promise<void> => {
  await delay(LATENCY_MS)
  db = db.filter((p) => p.id !== id)
}
