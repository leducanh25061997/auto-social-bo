import { useEffect, useState } from 'react'

import { Instagram } from 'lucide-react'

/**
 * Trang callback OAuth Instagram (route CÔNG KHAI, mở trong pop-up).
 * Đọc `code`/`error`/`state` trên URL, gửi về cửa sổ cha qua postMessage rồi tự đóng.
 */
const InstagramOAuthCallback = () => {
  const [closedManually, setClosedManually] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const message = {
      type: 'instagram-oauth' as const,
      code: params.get('code') ?? undefined,
      error: params.get('error') ?? undefined,
      state: params.get('state') ?? undefined,
    }

    try {
      if (window.opener) {
        window.opener.postMessage(message, window.location.origin)
        window.close()
        return
      }
    } catch {
      /* bỏ qua */
    }
    setClosedManually(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Instagram className="size-6" />
      </div>
      <p className="text-sm text-slate-500">
        {closedManually
          ? 'Bạn có thể đóng cửa sổ này và quay lại trang quản lý.'
          : 'Đang xử lý đăng nhập Instagram...'}
      </p>
    </div>
  )
}

export default InstagramOAuthCallback
