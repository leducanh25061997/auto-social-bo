import { Loader2 } from 'lucide-react'

/** Fallback hiển thị khi Suspense đang tải route/page (lazy import). */
export const PageLoader = () => (
  <div className="flex h-full min-h-[40vh] w-full animate-fade-in flex-col items-center justify-center gap-3">
    <Loader2 className="size-7 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">Đang tải...</p>
  </div>
)
