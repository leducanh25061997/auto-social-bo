---
name: build-backend-feature
description: Khi xây một tính năng ở BO (auto-social-bo) cần API backend mới (endpoint CRUD, auth, nghiệp vụ), dùng skill này để TỰ ĐỘNG scaffold luôn module tương ứng tại backend `D:\project\auto-social-api` theo đúng kiến trúc phân tầng của nó (routes → controller → service → repository → schema + Mongoose model). Kích hoạt khi: thêm feature FE gọi endpoint chưa có, hoặc user yêu cầu "xây BE / thêm API / tạo endpoint".
---

# Build Backend Feature (auto-social-api)

Mỗi khi một tính năng phía BO (`d:\project\auto-social-bo`) cần backend, **xây luôn** module
tương ứng tại `D:\project\auto-social-api` rồi mới nối FE. Tuyệt đối không để FE gọi endpoint
chưa tồn tại.

## Vị trí & lệnh

- Backend root: `D:\project\auto-social-api`
- Module mới: `src/modules/<feature>/`; Mongoose model: `src/models/<name>.model.ts`
- DB: **MongoDB qua Mongoose** (ĐÃ bỏ Prisma). Schema-less nên KHÔNG có migration —
  thêm model là dùng được ngay (Mongoose tự tạo collection/index khi chạy).
- Lệnh: `npm run dev` (tsx watch), `npm run typecheck`, `npm run lint`, `npm run seed`.

## Kiến trúc bắt buộc (theo `src/modules/auth` làm mẫu)

Mỗi module gồm 5 file, phân tầng nghiêm ngặt — KHÔNG nhảy tầng:

| File | Trách nhiệm |
|------|-------------|
| `<feature>.schema.ts` | Zod schema cho body/query/params; export type qua `z.infer`. |
| `<feature>.repository.ts` | Chỉ truy cập DB qua Mongoose model (`XxxModel.find…`). Trả entity PHẲNG qua `serialize<T>()` (đổi `_id`→`id`). Không chứa business logic. |
| `<feature>.service.ts` | Business logic; gọi repository; ném `ApiError.*` khi vi phạm nghiệp vụ. |
| `<feature>.controller.ts` | Điều phối: nhận req (đã validate), gọi service, trả response. KHÔNG logic. |
| `<feature>.routes.ts` | Khai báo route + middleware (`validate`, `requireAuth`, `requireRole`). |

### Quy ước chốt (lấy từ codebase, phải tuân thủ)

1. **Response envelope thành công**: `res.status(<code>).json({ status: 'success', data })`
   (hoặc `{ status: 'success', message }`). Lỗi do `errorHandler` tự trả
   `{ status, message, errors? }` — đừng tự format lỗi.
2. **Async controller** luôn bọc `catchAsync(...)` (từ `utils/catchAsync`) để forward lỗi.
3. **Lỗi nghiệp vụ** ném bằng `ApiError.badRequest|unauthorized|forbidden|notFound|conflict`
   (từ `utils/ApiError`) — KHÔNG `throw new Error`.
4. **Validate** bằng `validate({ body?, query?, params? })` (từ `middlewares/validate`) đặt
   TRƯỚC controller; controller ép kiểu `req.body as XxxInput`.
5. **Bảo vệ route**: `requireAuth` (Bearer access token → `req.user = { sub, role }`),
   `requireRole('ADMIN')` cho route quản trị. Rate limit: `authRateLimiter` cho auth-sensitive.
6. **Đăng ký route**: thêm vào `src/routes.ts`:
   `import { xxxRoutes } from './modules/<feature>/<feature>.routes'` rồi
   `router.use('/<prefix>', xxxRoutes)`. (apiRouter đã mount tại `/api/v1`.)
7. **DB (Mongoose)**: tạo `src/models/<name>.model.ts` — `new Schema<Doc>({...}, { timestamps: true,
   collection: 'snake_case' })`, export `XxxModel` (có guard `mongoose.models.X ?? model(...)`).
   Khai kiểu entity phẳng (`id: string` + field) trong `src/models/types.ts`. Repository dùng
   `.lean()` + `serialize<T>()` (`src/models/serialize.ts`) để trả entity phẳng. KHÔNG migration.
   Field unique optional → dùng partial index (`partialFilterExpression`) tránh lỗi trùng null.
   Quan hệ cha-con không có cascade DB → tự dọn ở repository `delete` (vd `deleteMany`).
8. **TS strict, KHÔNG `any`**. Validate type bằng zod, suy type từ schema.
9. **Lỗi trả về phải DỄ HIỂU cho người dùng** (tiếng Việt, không lộ chi tiết kỹ thuật) — ném
   `ApiError.*`; `errorHandler` đã map sẵn lỗi Mongoose (trùng khoá 11000 → 409, ValidationError →
   400, CastError → 404) ra thông báo thân thiện.

## Quy trình (checklist mỗi feature)

1. Xác định endpoint cần (method, path, body/query, quyền, response shape) từ nhu cầu FE.
2. (Nếu cần entity mới) Tạo `src/models/<name>.model.ts` + kiểu phẳng trong `src/models/types.ts`. KHÔNG migration.
3. Tạo `src/modules/<feature>/` đủ 5 file theo mẫu dưới.
4. Đăng ký router trong `src/routes.ts`.
5. `npm run typecheck` (và `lint`) ở backend — phải sạch.
6. Quay lại BO: tạo/nối tầng `src/features/<feature>/api/*.api.ts` dùng `apiClient`, gỡ envelope
   `{ status, data }`, validate response bằng zod (xem `features/auth/api/auth.api.ts` làm mẫu).
7. Báo lại user: endpoint đã thêm + có cần chạy migration/seed không.

## Khuôn mẫu (rút gọn) — thay `Widget`/`widget` bằng tên thật

```ts
// widget.schema.ts
import { z } from 'zod';
export const createWidgetSchema = z.object({ name: z.string().min(1).max(100) });
export const listWidgetQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type CreateWidgetInput = z.infer<typeof createWidgetSchema>;
export type ListWidgetQuery = z.infer<typeof listWidgetQuery>;
```

```ts
// src/models/widget.model.ts
import mongoose, { Schema, model, type Model } from 'mongoose';
export interface WidgetDoc { name: string; createdAt: Date; updatedAt: Date; }
const widgetSchema = new Schema<WidgetDoc>(
  { name: { type: String, required: true, trim: true } },
  { timestamps: true, collection: 'widgets' },
);
export const WidgetModel: Model<WidgetDoc> =
  (mongoose.models.Widget as Model<WidgetDoc>) ?? model<WidgetDoc>('Widget', widgetSchema);

// src/models/types.ts (thêm) → export interface Widget { id: string; name: string; createdAt: Date; updatedAt: Date; }
```

```ts
// widget.repository.ts
import { isValidObjectId } from 'mongoose';
import { WidgetModel } from '../../models/widget.model';
import { serialize, serializeMany } from '../../models/serialize';
import type { Widget } from '../../models/types';
export const widgetRepository = {
  async create(data: { name: string }): Promise<Widget> {
    return serialize<Widget>((await WidgetModel.create(data)).toObject()) as Widget;
  },
  async findById(id: string): Promise<Widget | null> {
    if (!isValidObjectId(id)) return null;
    return serialize<Widget>(await WidgetModel.findById(id).lean());
  },
  async list(skip: number, take: number): Promise<Widget[]> {
    return serializeMany<Widget>(
      await WidgetModel.find().sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
    );
  },
  count(): Promise<number> { return WidgetModel.countDocuments(); },
};
```

```ts
// widget.service.ts
import { widgetRepository } from './widget.repository';
import { ApiError } from '../../utils/ApiError';
import type { CreateWidgetInput, ListWidgetQuery } from './widget.schema';
export const widgetService = {
  create(input: CreateWidgetInput) { return widgetRepository.create({ ...input }); },
  async getById(id: string) {
    const w = await widgetRepository.findById(id);
    if (!w) throw ApiError.notFound('Widget không tồn tại');
    return w;
  },
  async list(q: ListWidgetQuery) {
    const [items, total] = await Promise.all([
      widgetRepository.list((q.page - 1) * q.limit, q.limit),
      widgetRepository.count(),
    ]);
    return { items, total, page: q.page, limit: q.limit };
  },
};
```

```ts
// widget.controller.ts
import type { Request, Response } from 'express';
import { widgetService } from './widget.service';
import { catchAsync } from '../../utils/catchAsync';
import type { CreateWidgetInput, ListWidgetQuery } from './widget.schema';
export const widgetController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const data = await widgetService.create(req.body as CreateWidgetInput);
    res.status(201).json({ status: 'success', data });
  }),
  list: catchAsync(async (req: Request, res: Response) => {
    const data = await widgetService.list(req.query as unknown as ListWidgetQuery);
    res.status(200).json({ status: 'success', data });
  }),
};
```

```ts
// widget.routes.ts
import { Router } from 'express';
import { widgetController } from './widget.controller';
import { createWidgetSchema, listWidgetQuery } from './widget.schema';
import { validate } from '../../middlewares/validate';
import { requireAuth } from '../../middlewares/requireAuth';
const router = Router();
router.use(requireAuth); // mọi route widget cần đăng nhập
router.get('/', validate({ query: listWidgetQuery }), widgetController.list);
router.post('/', validate({ body: createWidgetSchema }), widgetController.create);
export const widgetRoutes = router;
```

```ts
// src/routes.ts (thêm)
import { widgetRoutes } from './modules/widget/widget.routes';
router.use('/widgets', widgetRoutes);
```

## Phía BO — nối FE

- Response của backend luôn bọc `{ status, data }` → gỡ `.data` ở tầng `api`.
- Dùng `apiClient` (`src/lib/api-client.ts`); endpoint tương đối `'/widgets'` (BASE_URL =
  `VITE_API_BASE_URL` = `/api/v1`, dev có proxy Vite → backend).
- Validate response bằng zod schema trong `features/<feature>/types`.
- Server state qua TanStack Query; tuân [[coding-standards]] và [[ui-component-standards]]
  (DataTable phân trang mặc định 10 — khớp `limit` mặc định ở backend).
