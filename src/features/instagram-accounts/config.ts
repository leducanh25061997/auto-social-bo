/**
 * Cấu hình OAuth Instagram phía client ("Instagram API with Instagram Login").
 * APP_ID lấy từ `VITE_INSTAGRAM_APP_ID`. Khi trống, nút "Kết nối Instagram" sẽ báo
 * trạng thái chưa cấu hình thay vì lỗi.
 */
export const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID ?? ''

/** Quyền tối thiểu để lấy hồ sơ cơ bản. */
export const INSTAGRAM_SCOPES = 'instagram_business_basic'

/** Đường dẫn trang callback nhận `code` từ Instagram (route công khai). */
export const INSTAGRAM_REDIRECT_PATH = '/oauth/instagram/callback'

/** Đã cấu hình App ID hay chưa. */
export const isInstagramConfigured = Boolean(INSTAGRAM_APP_ID)

/** URL tuyệt đối của trang callback (phải khớp redirect URI trong Meta App). */
export const getInstagramRedirectUri = (): string =>
  `${window.location.origin}${INSTAGRAM_REDIRECT_PATH}`
