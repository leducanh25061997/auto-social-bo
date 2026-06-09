/**
 * Cấu hình OAuth Facebook phía client.
 * APP_ID lấy từ biến môi trường `VITE_FACEBOOK_APP_ID`. Khi để trống, nút "Kết nối
 * Facebook" sẽ hiển thị trạng thái chưa cấu hình thay vì lỗi.
 */
export const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID ?? ''

/** Phiên bản Graph API dùng cho URL OAuth dialog (khớp backend). */
export const FACEBOOK_GRAPH_VERSION = 'v23.0'

/**
 * Quyền yêu cầu — tối thiểu để lấy hồ sơ + xem danh sách Page.
 * (Không xin quyền đăng bài để giữ phạm vi gọn, dễ được Facebook chấp thuận.)
 */
export const FACEBOOK_SCOPES = 'public_profile,pages_show_list,pages_read_engagement'

/** Đường dẫn trang callback nhận `code` từ Facebook (route công khai). */
export const FACEBOOK_REDIRECT_PATH = '/oauth/facebook/callback'

/** Đã cấu hình App ID hay chưa. */
export const isFacebookConfigured = Boolean(FACEBOOK_APP_ID)

/** URL tuyệt đối của trang callback (phải khớp redirect URI hợp lệ trong Meta App). */
export const getFacebookRedirectUri = (): string =>
  `${window.location.origin}${FACEBOOK_REDIRECT_PATH}`
