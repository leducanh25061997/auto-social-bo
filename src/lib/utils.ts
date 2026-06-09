import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gộp các class Tailwind một cách an toàn:
 * - `clsx` xử lý các giá trị điều kiện (object/array/falsy).
 * - `twMerge` loại bỏ xung đột giữa các class Tailwind (vd: px-2 px-4 -> px-4).
 *
 * BẮT BUỘC dùng `cn()` khi truyền `className` qua props thay vì nối chuỗi thủ công.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
