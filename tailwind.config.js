/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        // Font mặc định toàn app (self-host ở src/assets/fonts, khai báo @font-face ở index.css).
        sans: [
          '"Be Vietnam Pro"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      /*
       * Thang box-shadow MỀM, nhiều lớp, tông slate (rgb 15 23 42) thay vì đen
       * tuyền — ghi đè scale mặc định của Tailwind nên MỌI `shadow-*` đang dùng
       * khắp app tự động dịu & sang hơn mà không phải sửa từng component.
       */
      boxShadow: {
        sm: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        DEFAULT:
          '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        md: '0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 6px -2px rgb(15 23 42 / 0.05)',
        lg: '0 12px 24px -6px rgb(15 23 42 / 0.10), 0 4px 10px -4px rgb(15 23 42 / 0.06)',
        xl: '0 24px 48px -12px rgb(15 23 42 / 0.14), 0 8px 16px -8px rgb(15 23 42 / 0.08)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Xuất hiện mờ dần (dùng cho overlay/loader).
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Xuất hiện mờ dần + trượt nhẹ lên (dùng cho nội dung trang khi chuyển route).
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Vệt sáng quét ngang cho skeleton (cảm giác đang tải mượt hơn pulse).
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
