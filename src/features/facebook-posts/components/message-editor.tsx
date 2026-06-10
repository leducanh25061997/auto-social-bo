import { useEffect, useRef, useState } from 'react'
import { Hash, Smile } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/**
 * Ô soạn nội dung bài đăng — plain text (đúng những gì Facebook hiển thị) kèm
 * tiện ích: chèn emoji & hashtag tại vị trí con trỏ + đếm ký tự.
 *
 * KHÔNG dùng rich text: Facebook Page chỉ nhận plain text (chỉ giữ xuống dòng,
 * emoji, link, hashtag) nên WYSIWYG thật sự = soạn sao đăng vậy.
 */
interface MessageEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength: number
  placeholder?: string
  rows?: number
}

/** Bộ emoji phổ biến, gom theo nhóm (đủ dùng, không cần thư viện ngoài). */
const EMOJI_GROUPS: { key: string; label: string; emojis: string[] }[] = [
  {
    key: 'smileys',
    label: 'Cảm xúc',
    emojis: [
      '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😎', '🤩', '🥳',
      '😉', '🙂', '😇', '🤔', '😴', '😅', '😭', '😡', '😱', '🥰',
      '😢', '😏', '🙃', '😋', '😜', '🤗', '🤭', '😬', '😌', '😔',
    ],
  },
  {
    key: 'gestures',
    label: 'Cử chỉ',
    emojis: [
      '👍', '👎', '👏', '🙌', '🙏', '👌', '✌️', '🤞', '💪', '👋',
      '🤝', '✋', '👇', '👉', '👈', '☝️', '🤙', '🫶', '🤟', '✍️',
    ],
  },
  {
    key: 'hearts',
    label: 'Trái tim',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖', '💘',
      '💕', '💞', '💗', '💓', '💝', '❣️', '💔', '❤️‍🔥', '💟', '♥️',
    ],
  },
  {
    key: 'objects',
    label: 'Vật & Lễ hội',
    emojis: [
      '🔥', '✨', '⭐', '🌟', '💯', '🎉', '🎊', '🎁', '🏆', '🥇',
      '📌', '📣', '🔔', '💡', '⏰', '📅', '✅', '⚡', '🚀', '🎯',
    ],
  },
  {
    key: 'nature',
    label: 'Thiên nhiên & Ăn uống',
    emojis: [
      '🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌈', '☀️', '🌙', '⛅',
      '🍎', '🍔', '🍰', '☕', '🍻', '🍦', '🍩', '🍕', '🥗', '🍓',
    ],
  },
]

export const MessageEditor = ({
  value,
  onChange,
  maxLength,
  placeholder,
  rows = 6,
}: MessageEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [group, setGroup] = useState(EMOJI_GROUPS[0].key)

  // Đóng picker khi bấm ra ngoài.
  useEffect(() => {
    if (!pickerOpen) return
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [pickerOpen])

  /** Chèn `text` tại vị trí con trỏ (hoặc cuối nếu mất focus), tôn trọng maxLength. */
  const insertAtCursor = (text: string) => {
    const el = textareaRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const next = value.slice(0, start) + text + value.slice(end)
    if (next.length > maxLength) return
    onChange(next)
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      const pos = start + text.length
      el.setSelectionRange(pos, pos)
    })
  }

  const activeGroup = EMOJI_GROUPS.find((g) => g.key === group) ?? EMOJI_GROUPS[0]

  return (
    <div>
      <div className="relative rounded-lg border border-input bg-transparent focus-within:border-primary">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          className="resize-y border-0 focus-visible:ring-0"
        />

        {/* Thanh công cụ */}
        <div className="flex items-center gap-1 border-t border-slate-100 px-2 py-1.5">
          <div className="relative" ref={pickerRef}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-muted-foreground"
              onClick={() => setPickerOpen((o) => !o)}
            >
              <Smile className="size-4" />
              Emoji
            </Button>

            {pickerOpen && (
              <div className="absolute bottom-10 left-0 z-50 w-72 rounded-xl border border-slate-200 bg-popover p-2 shadow-lg">
                <div className="mb-2 flex flex-wrap gap-1">
                  {EMOJI_GROUPS.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setGroup(g.key)}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors',
                        group === g.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-slate-500 hover:bg-slate-100',
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                <div className="grid max-h-44 grid-cols-8 gap-0.5 overflow-y-auto">
                  {activeGroup.emojis.map((emoji, i) => (
                    <button
                      key={`${emoji}-${i}`}
                      type="button"
                      onClick={() => insertAtCursor(emoji)}
                      className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-slate-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-muted-foreground"
            onClick={() => insertAtCursor('#')}
          >
            <Hash className="size-4" />
            Hashtag
          </Button>

          <span className="ml-auto pr-1 text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  )
}
