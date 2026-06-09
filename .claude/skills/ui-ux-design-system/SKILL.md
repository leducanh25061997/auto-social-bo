---
name: ui-ux-design-system
description: Khi viết hoặc chỉnh BẤT KỲ giao diện nào ở BO (auto-social-bo) — trang, component, dialog, form, bảng, card, layout — dùng skill này để áp đúng design system "Clean, Bright & Modern". Kích hoạt khi: thêm/sửa UI, tạo page/feature mới, override className của Shadcn, hoặc user yêu cầu "làm đẹp / chỉnh UI / theo phong cách...".
---

# Design System — "Clean, Bright & Modern"

Đóng vai một UI/UX Designer xuất sắc. Mọi giao diện phải **sạch sẽ, tươi sáng, hiện đại**, thoáng đãng. Stack: Tailwind CSS + Shadcn UI (Radix). Xem thêm [[coding-standards]] và [[ui-component-standards]].

## Nguyên tắc nền tảng (ĐÃ cấu hình sẵn ở token — đừng phá)

Design system được lái bằng **CSS variables** trong `src/index.css` + `tailwind.config.js`. Khi cần đổi tông toàn cục → sửa token, KHÔNG hardcode rải rác.

| Token | Giá trị | Ý nghĩa |
|---|---|---|
| `--background` | slate ~94% | nền trang (canvas) — hơi xám để thẻ trắng nổi khối |
| `--card` | white | thẻ / bảng / khu vực nội dung |
| `--primary` | **blue-600** (`221 83% 53%`) | màu chủ đạo: nút chính, active, icon nhấn |
| `--ring` / `--accent` | tone xanh | focus + hover on-brand |
| `--foreground` | **slate-900** | KHÔNG dùng `text-black` |
| `--muted-foreground` | slate-500 | văn bản phụ |
| `--radius` | `0.625rem` | bo góc mềm |
| `font-sans` | **Be Vietnam Pro** | font mặc định (self-host `src/assets/fonts`, weight 400/500/600/700/800) |

→ Vì tất cả component Shadcn tiêu thụ các token này, **đổi token là cả hệ đổi theo**. Ưu tiên class semantic (`bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border`) thay vì màu cứng, để tự hỗ trợ dark mode.

## 1. Màu sắc

- **Nền trang**: `bg-slate-50` / để mặc định `bg-background`. Khu vực nội dung/thẻ/bảng: `bg-white` (hoặc `bg-card`).
- **Primary**: `blue-600`, `indigo-500`, hoặc `emerald-500` cho nút chính / icon nổi / trạng thái active. Dùng `bg-primary` mặc định.
- **Text**: tiêu đề `text-slate-900` (hoặc `text-foreground`); phụ/mô tả `text-slate-500` / `text-slate-600` (hoặc `text-muted-foreground`). **Tuyệt đối không `text-black`.**

## 2. Hình khối & viền

- **Card / Modal / Dialog**: `rounded-2xl` (đã set sẵn ở `ui/card` và `ui/dialog`). Khối phụ/bảng: `rounded-xl`.
- **Button / Input / Select**: `rounded-lg` (đã set sẵn).
- **Viền mỏng, nhạt**: `border border-slate-200` hoặc `border-slate-100`. KHÔNG viền đậm.

## 3. Chiều sâu & hiệu ứng

- **Shadow**: `shadow-sm` cho phần tử nhỏ (input focus, dropdown). `shadow-md` (kèm bóng màu nhẹ `shadow-blue-500/20`) cho Card quan trọng để "nổi bồng bềnh".
- **Hover & transition**: MỌI nút/link/table-row đều phải có hover. Luôn `transition-all duration-200` + đổi nền nhẹ (`hover:bg-slate-100` / `hover:bg-accent`) hoặc đẩy lên (`hover:-translate-y-0.5`).
- **Gradient (điểm nhấn)**: khu vực nổi bật (hero dashboard, thẻ thống kê, logo) dùng gradient nhẹ: `bg-gradient-to-r from-blue-600 to-cyan-500` hoặc `from-blue-500 to-indigo-500`.

## 4. Không gian (whitespace)

- Hào phóng padding: Card dùng `p-6` → `p-8`, KHÔNG ép chật.
- Khoảng cách Flex/Grid rộng rãi: `gap-4` → `gap-6`.

## Quy tắc với Shadcn

- Ưu tiên **import sẵn** từ `@/components/ui` — chúng ĐÃ được style theo design system này. Đừng tự dựng lại bằng thẻ HTML thuần.
- Khi cần override, dùng `cn()` để merge, ví dụ thẻ nổi bật:
  `<Card className="border-none shadow-md shadow-blue-500/10 rounded-2xl">`
- Bảng dữ liệu → luôn `DataTable` (`@/components/common/data-table`), đã có header nền nhạt + row hover xanh + bo `rounded-xl` + phân trang mặc định 10.
- Tiêu đề trang → `PageHeader` (`@/components/common/page-header`).

## Checklist trước khi xong 1 màn hình

1. Nền trang sáng, thẻ trắng nổi khối? (không để mọi thứ phẳng lì)
2. Nút chính dùng `bg-primary` (blue)? Không có `text-black`?
3. Card/Dialog `rounded-2xl`, viền nhạt, có shadow nhẹ?
4. Mọi phần tử tương tác có `hover` + `transition`?
5. Padding/gap đủ thoáng (`p-6`+, `gap-4`+)?
6. Có ít nhất 1 điểm nhấn gradient ở khu vực hero/nổi bật (nếu là trang chính)?
7. `npm run typecheck` + `npm run build` sạch.
