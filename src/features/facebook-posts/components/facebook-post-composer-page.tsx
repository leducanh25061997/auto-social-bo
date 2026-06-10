import { useRef } from 'react'
import {
  CalendarClock,
  FileText,
  Film,
  ImagePlus,
  Link2,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppAlert } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/common/page-header'
import { useFacebookPostComposer } from '@/features/facebook-posts/hooks/use-facebook-post-composer'
import { FacebookPostPreview } from '@/features/facebook-posts/components/facebook-post-preview'
import { MessageEditor } from '@/features/facebook-posts/components/message-editor'
import { imageSrc } from '@/features/facebook-posts/utils/post.utils'

const MAX_MESSAGE = 5000

/** Section dạng thẻ nổi khối: số thứ tự + tiêu đề + nội dung. */
const Section = ({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm shadow-blue-500/30">
        {step}
      </span>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </section>
)

const FacebookPostComposerPage = () => {
  const c = useFacebookPostComposer()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const isReel = c.postType === 'reel'
  const previewVideoSrc = c.videoUrl || c.videoPath || c.videoUrlInput.trim()
  const timeLabel =
    c.mode === 'schedule' && c.scheduledAt
      ? `Lên lịch ${new Date(c.scheduledAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}`
      : 'Vừa xong'

  const submitLabel = c.isEdit
    ? c.mode === 'schedule'
      ? 'Cập nhật lịch'
      : 'Lưu thay đổi'
    : c.mode === 'publish'
      ? 'Đăng ngay'
      : c.mode === 'schedule'
        ? 'Lên lịch'
        : 'Lưu nháp'

  const modeOptions = [
    { value: 'draft' as const, label: 'Lưu nháp', hint: 'Lưu lại, đăng sau' },
    { value: 'schedule' as const, label: 'Lên lịch', hint: 'Tự đăng vào giờ đã chọn' },
    ...(!c.isEdit
      ? [{ value: 'publish' as const, label: 'Đăng ngay', hint: 'Đăng lên Page lập tức' }]
      : []),
  ]

  return (
    <div>
      <PageHeader
        title={c.isEdit ? 'Sửa bài đăng' : 'Tạo bài đăng'}
        description="Soạn nội dung, xem trước rồi lưu nháp / lên lịch / đăng ngay lên Page."
      />

      {c.isLoadingDetail && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Đang tải bài đăng...
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* LEFT: form */}
        <div className="space-y-5">
          {/* 1. Tài khoản + Page */}
          <Section step={1} title="Chọn tài khoản & Page">
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={c.accountId} onValueChange={c.handleAccountChange} disabled={c.isEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản Facebook" />
                </SelectTrigger>
                <SelectContent>
                  {c.accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      <span className="flex items-center gap-2">
                        <Avatar className="size-5">
                          {a.picture && <AvatarImage src={a.picture} alt={a.name} />}
                          <AvatarFallback>{a.name[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {a.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Select
                  value={c.pageId}
                  onValueChange={c.setPageId}
                  disabled={!c.accountId || c.isLoadingPages}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      placeholder={
                        !c.accountId
                          ? 'Chọn tài khoản trước'
                          : c.isLoadingPages
                            ? 'Đang tải Page...'
                            : c.pages.length === 0
                              ? 'Không có Page nào'
                              : 'Chọn Page'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {c.pages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          <Avatar className="size-5">
                            {p.picture && <AvatarImage src={p.picture} alt={p.name} />}
                            <AvatarFallback>{p.name[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {p.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {c.accountId && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => c.refetchPages()}
                    loading={c.isLoadingPages}
                    aria-label="Tải lại danh sách Page"
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                )}
              </div>
            </div>
            {c.accountId && !c.isLoadingPages && c.pages.length === 0 && (
              <AppAlert variant="warning" title="Tài khoản chưa quản trị Page nào">
                Cần cấp quyền <b>pages_show_list</b> &amp; <b>pages_manage_posts</b> khi kết nối
                Facebook để chọn Page và đăng bài.
              </AppAlert>
            )}
          </Section>

          {/* 2. Loại bài */}
          <Section step={2} title="Loại bài đăng">
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'feed', label: 'Bài viết', hint: 'Văn bản + ảnh', icon: FileText },
                { value: 'reel', label: 'Reel', hint: 'Video dọc', icon: Film },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={c.isEdit}
                  onClick={() => c.setPostType(opt.value)}
                  className={cn(
                    'flex items-start gap-2 rounded-xl border-2 p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                    c.postType === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-primary/40',
                  )}
                >
                  <opt.icon
                    className={cn(
                      'mt-0.5 size-5',
                      c.postType === opt.value ? 'text-primary' : 'text-slate-400',
                    )}
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            {c.isEdit && (
              <p className="text-xs text-muted-foreground">Không thể đổi loại bài khi đang sửa.</p>
            )}
          </Section>

          {/* 3. Nội dung */}
          <Section step={3} title={isReel ? 'Chú thích reel' : 'Nội dung bài viết'}>
            <MessageEditor
              value={c.message}
              onChange={c.setMessage}
              maxLength={MAX_MESSAGE}
              placeholder={isReel ? 'Viết chú thích cho reel...' : 'Bạn đang nghĩ gì?'}
            />
          </Section>

          {/* 4. Media */}
          <Section step={4} title={isReel ? 'Video reel' : 'Hình ảnh'}>
            {isReel ? (
              <div className="space-y-3">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => {
                    c.addVideo(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
                {!c.hasVideo ? (
                  <>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      {c.isUploadingVideo ? (
                        <Loader2 className="size-7 animate-spin text-primary" />
                      ) : (
                        <Film className="size-7 text-primary" />
                      )}
                      <span className="text-sm font-medium text-slate-700">
                        Bấm để tải video lên
                      </span>
                      <span className="text-xs text-muted-foreground">MP4/MOV, video dọc 9:16</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <Link2 className="size-4 text-muted-foreground" />
                      <Input
                        placeholder="hoặc dán URL video công khai..."
                        value={c.videoUrlInput}
                        onChange={(e) => c.setVideoUrlInput(e.target.value)}
                        onBlur={c.applyVideoUrl}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <video
                      src={previewVideoSrc}
                      controls
                      className="max-h-56 max-w-[180px] rounded-lg border bg-black"
                    />
                    <Button variant="outline" size="sm" onClick={c.removeVideo}>
                      <X className="size-4" /> Gỡ video
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    c.addImages(e.target.files)
                    e.target.value = ''
                  }}
                />
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {c.images.map((img, idx) => (
                    <div
                      key={img.imagePath || img.imageUrl || idx}
                      className="relative aspect-square overflow-hidden rounded-lg border border-slate-200"
                    >
                      <img src={imageSrc(img)} alt="" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => c.removeImage(idx)}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        aria-label="Xoá ảnh"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                  {c.images.length < 10 && (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      {c.isUploadingImages ? (
                        <Loader2 className="size-5 animate-spin text-primary" />
                      ) : (
                        <ImagePlus className="size-5" />
                      )}
                      <span className="text-[11px]">Thêm ảnh</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{c.images.length}/10 ảnh</p>
              </div>
            )}
          </Section>

          {/* 5. Comment đầu tiên */}
          <Section step={5} title="Comment đầu tiên (tuỳ chọn)">
            <div className="flex items-start justify-between gap-3">
              <p className="-mt-0.5 text-xs text-muted-foreground">
                Nội dung này sẽ được tự động đăng thành bình luận đầu tiên dưới bài ngay sau khi
                đăng — tiện để chèn link, hashtag hoặc thông tin thêm. Bạn có thể tự nhập hoặc để
                AI gợi ý dựa trên nội dung bài.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={c.generateComment}
                loading={c.isGeneratingComment}
                disabled={c.isGeneratingComment}
                className="shrink-0"
              >
                {!c.isGeneratingComment &&
                  (c.firstComment.trim() ? (
                    <RefreshCw className="size-4" />
                  ) : (
                    <Sparkles className="size-4" />
                  ))}
                {c.firstComment.trim() ? 'Gợi ý lại' : 'Gợi ý bằng AI'}
              </Button>
            </div>
            <MessageEditor
              value={c.firstComment}
              onChange={c.setFirstComment}
              maxLength={MAX_MESSAGE}
              rows={3}
              placeholder="Ví dụ: 👉 Xem thêm tại website..., hoặc bấm “Gợi ý bằng AI” để tạo tự động."
            />
          </Section>

          {/* 6. Hành động */}
          <Section step={6} title="Xuất bản">
            <div className="grid gap-3 sm:grid-cols-3">
              {modeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => c.setMode(opt.value)}
                  className={cn(
                    'rounded-xl border-2 p-3 text-left transition-colors',
                    c.mode === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-primary/40',
                  )}
                >
                  <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                </button>
              ))}
            </div>

            {c.mode === 'schedule' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Thời gian đăng
                </label>
                <Input
                  type="datetime-local"
                  value={c.scheduledAt}
                  min={c.minScheduleLocalValue()}
                  onChange={(e) => c.setScheduledAt(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Hệ thống sẽ tự đăng vào thời điểm này (phải cách hiện tại ≥ 5 phút).
                </p>
              </div>
            )}
          </Section>

          <div className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Button variant="ghost" onClick={c.cancel} disabled={c.isSubmitting}>
              Huỷ
            </Button>
            <Button onClick={c.submit} loading={c.isSubmitting} className="min-w-36">
              {c.mode === 'publish' ? (
                <Send className="size-4" />
              ) : c.mode === 'schedule' ? (
                <CalendarClock className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {submitLabel}
            </Button>
          </div>
        </div>

        {/* RIGHT: preview — canh mép trên với cột trái, chiều cao tự tăng theo nội dung (không full) */}
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-blue-500/10 sm:p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Xem trước
            </p>
            <FacebookPostPreview
              pageName={c.selectedPage?.name ?? ''}
              pagePicture={c.selectedPage?.picture}
              message={c.message}
              postType={c.postType}
              images={c.images}
              videoSrc={previewVideoSrc}
              timeLabel={timeLabel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacebookPostComposerPage
