/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** App ID của Meta App để đăng nhập Facebook (có thể trống nếu chưa dùng). */
  readonly VITE_FACEBOOK_APP_ID?: string
  /** App ID của Instagram App để đăng nhập Instagram (có thể trống nếu chưa dùng). */
  readonly VITE_INSTAGRAM_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
