import { Globe, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { imageSrc } from '@/features/facebook-posts/utils/post.utils'
import type {
  FacebookPostImage,
  FacebookPostType,
} from '@/features/facebook-posts/types/facebook-post.types'

interface FacebookPostPreviewProps {
  pageName: string
  pagePicture?: string | null
  message: string
  postType: FacebookPostType
  images: FacebookPostImage[]
  videoSrc: string
  timeLabel: string
}

/** Lưới ảnh kiểu Facebook: 1 ảnh full; nhiều ảnh xếp lưới, ảnh thứ 4 phủ "+N". */
const PreviewImages = ({ images }: { images: FacebookPostImage[] }) => {
  if (!images.length) return null
  if (images.length === 1) {
    return (
      <div className="bg-slate-100">
        <img src={imageSrc(images[0])} alt="" className="max-h-[380px] w-full object-cover" />
      </div>
    )
  }
  const shown = images.slice(0, 4)
  const extra = images.length - shown.length
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-slate-100">
      {shown.map((img, idx) => (
        <div
          key={img.imagePath || img.imageUrl || idx}
          className={`relative h-44 ${shown.length === 3 && idx === 2 ? 'col-span-2' : ''}`}
        >
          <img src={imageSrc(img)} alt="" className="size-full object-cover" />
          {idx === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
              +{extra}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Khung xem trước bài đăng — giống giao diện Facebook để duyệt trước khi đăng. */
export const FacebookPostPreview = ({
  pageName,
  pagePicture,
  message,
  postType,
  images,
  videoSrc,
  timeLabel,
}: FacebookPostPreviewProps) => {
  const isReel = postType === 'reel'
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <Avatar className="size-10">
          {pagePicture && <AvatarImage src={pagePicture} alt={pageName} />}
          <AvatarFallback>{pageName?.[0]?.toUpperCase() ?? 'P'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {pageName || 'Tên Page'}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{timeLabel}</span>
            <span>·</span>
            <Globe className="size-3" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="px-4 pb-3">
        <p className="min-h-[24px] whitespace-pre-wrap text-sm text-slate-800">
          {message || (
            <span className="italic text-muted-foreground">
              {isReel ? 'Chú thích reel sẽ hiển thị tại đây...' : 'Nội dung bài viết sẽ hiển thị tại đây...'}
            </span>
          )}
        </p>
      </div>

      {/* Media */}
      {isReel ? (
        videoSrc ? (
          <div className="flex justify-center bg-black">
            <video
              src={videoSrc}
              controls
              className="max-h-[520px] w-auto"
              style={{ aspectRatio: '9 / 16' }}
            />
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center bg-black text-sm text-slate-400">
            Video reel sẽ hiển thị tại đây
          </div>
        )
      ) : (
        <PreviewImages images={images} />
      )}

      {/* Footer */}
      <div className="flex items-center justify-around border-t border-slate-100 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="size-4" /> Thích
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-4" /> Bình luận
        </span>
        <span className="flex items-center gap-1.5">
          <Share2 className="size-4" /> Chia sẻ
        </span>
      </div>
    </div>
  )
}
