import { useEffect, useState } from 'react'

/**
 * Trả về phiên bản "trễ" của giá trị — chỉ cập nhật sau khi `value` ngừng đổi
 * trong `delay` ms. Dùng cho ô tìm kiếm để tránh gọi API theo từng phím gõ.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
