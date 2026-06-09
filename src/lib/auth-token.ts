/**
 * Lưu access token TRONG BỘ NHỚ (module variable) — KHÔNG dùng localStorage/
 * sessionStorage để giảm rủi ro bị đánh cắp token qua XSS.
 *
 * Vòng đời: set khi đăng nhập/refresh thành công, xoá khi đăng xuất. Mất khi
 * reload trang là CHỦ Ý — phiên được khôi phục bằng "silent refresh" dựa trên
 * httpOnly refresh cookie (xem `features/auth`).
 *
 * Tách riêng khỏi store để `api-client` đọc token mà không tạo phụ thuộc vòng
 * (circular import) vào tầng feature/store.
 */
let accessToken: string | null = null

export const getAccessToken = (): string | null => accessToken

export const setAccessToken = (token: string | null): void => {
  accessToken = token
}
