import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { notify } from '@/lib/notify'
import { useGetFacebookAccounts } from '@/features/facebook-accounts/hooks/use-facebook-accounts'
import { useGetFacebookPages } from '@/features/facebook-accounts/hooks/use-facebook-pages'
import {
  createFacebookPost,
  generateFacebookPostComment,
  updateFacebookPost,
  uploadFacebookPostImages,
  uploadFacebookPostVideo,
} from '@/features/facebook-posts/api/facebook-posts.api'
import { useFacebookPost } from '@/features/facebook-posts/hooks/use-facebook-posts'
import {
  MIN_SCHEDULE_LEAD_MINUTES,
  minScheduleLocalValue,
  toDatetimeLocalValue,
} from '@/features/facebook-posts/utils/post.utils'
import type {
  FacebookPostImage,
  FacebookPostType,
} from '@/features/facebook-posts/types/facebook-post.types'

export type ComposerMode = 'draft' | 'schedule' | 'publish'
const MAX_IMAGES = 10

/** Toàn bộ logic trang soạn bài (tạo mới + sửa). Tách khỏi View. */
export const useFacebookPostComposer = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [accountId, setAccountId] = useState('')
  const [pageId, setPageId] = useState('')
  const [postType, setPostType] = useState<FacebookPostType>('feed')
  const [message, setMessage] = useState('')
  const [firstComment, setFirstComment] = useState('')
  const [images, setImages] = useState<FacebookPostImage[]>([])
  const [videoPath, setVideoPath] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoUrlInput, setVideoUrlInput] = useState('')
  const [mode, setMode] = useState<ComposerMode>('draft')
  const [scheduledAt, setScheduledAt] = useState('')

  // Tài khoản (chỉ những tài khoản đang hoạt động mới đăng được).
  const { data: accountsData } = useGetFacebookAccounts({ page: 1, status: 'active' })
  const accounts = useMemo(() => accountsData?.items ?? [], [accountsData])

  // Page của tài khoản đã chọn.
  const {
    data: pages = [],
    isFetching: isLoadingPages,
    refetch: refetchPages,
  } = useGetFacebookPages(accountId || null)

  const selectedPage = useMemo(() => pages.find((p) => p.id === pageId) ?? null, [pages, pageId])
  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === accountId) ?? null,
    [accounts, accountId],
  )

  // Nạp chi tiết khi sửa.
  const { data: detail, isFetching: isLoadingDetail } = useFacebookPost(id)
  useEffect(() => {
    if (!isEdit || !detail) return
    setAccountId(detail.facebookAccountId)
    setPageId(detail.pageId)
    setPostType(detail.postType)
    setMessage(detail.message)
    setFirstComment(detail.firstComment)
    setImages(detail.images)
    setVideoPath(detail.videoPath)
    setVideoUrl(detail.videoUrl)
    setVideoUrlInput(detail.videoUrl)
    if (detail.status === 'scheduled' && detail.scheduledAt) {
      setMode('schedule')
      setScheduledAt(toDatetimeLocalValue(new Date(detail.scheduledAt)))
    } else {
      setMode('draft')
    }
  }, [isEdit, detail])

  // Đổi tài khoản → reset Page đã chọn (trừ khi đang nạp bài để sửa).
  const handleAccountChange = useCallback((value: string) => {
    setAccountId(value)
    setPageId('')
  }, [])

  // ── Upload ảnh ────────────────────────────────────────────────────────────
  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) => uploadFacebookPostImages(files),
    onSuccess: (uploaded) => {
      setImages((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES))
    },
    onError: (error) => notify.apiError(error, 'Tải ảnh lên thất bại'),
  })

  const addImages = useCallback(
    (fileList: FileList | null) => {
      const picked = Array.from(fileList ?? []).filter((f) => f.type.startsWith('image/'))
      if (!picked.length) return
      const remaining = MAX_IMAGES - images.length
      if (remaining <= 0) {
        notify.warning(`Tối đa ${MAX_IMAGES} ảnh mỗi bài`)
        return
      }
      uploadImagesMutation.mutate(picked.slice(0, remaining))
    },
    [images.length, uploadImagesMutation],
  )

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // ── Upload video ──────────────────────────────────────────────────────────
  const uploadVideoMutation = useMutation({
    mutationFn: (file: File) => uploadFacebookPostVideo(file),
    onSuccess: (data) => {
      setVideoPath(data.videoPath)
      setVideoUrl(data.videoUrl)
      setVideoUrlInput('')
    },
    onError: (error) => notify.apiError(error, 'Tải video lên thất bại'),
  })

  const addVideo = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!file.type.startsWith('video/')) {
        notify.warning('Vui lòng chọn tệp video')
        return
      }
      uploadVideoMutation.mutate(file)
    },
    [uploadVideoMutation],
  )

  const removeVideo = useCallback(() => {
    setVideoPath('')
    setVideoUrl('')
    setVideoUrlInput('')
  }, [])

  const applyVideoUrl = useCallback(() => {
    const trimmed = videoUrlInput.trim()
    if (trimmed) {
      setVideoUrl(trimmed)
      setVideoPath('')
    }
  }, [videoUrlInput])

  // ── Gợi ý comment bằng AI ───────────────────────────────────────────────────
  const generateCommentMutation = useMutation({
    mutationFn: () =>
      generateFacebookPostComment({
        message: message.trim(),
        pageName: selectedPage?.name,
      }),
    onSuccess: (comment) => {
      setFirstComment(comment)
      notify.success('Đã tạo gợi ý comment bằng AI')
    },
    onError: (error) => notify.apiError(error, 'Tạo gợi ý comment thất bại'),
  })

  const generateComment = useCallback(() => {
    if (!message.trim()) {
      notify.warning('Hãy nhập nội dung bài viết trước để AI gợi ý comment')
      return
    }
    generateCommentMutation.mutate()
  }, [message, generateCommentMutation])

  // ── Submit ──────────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const pageName = selectedPage?.name ?? ''
      const scheduledIso =
        mode === 'schedule' && scheduledAt ? new Date(scheduledAt).toISOString() : null
      const videoFields =
        postType === 'reel'
          ? { videoPath, videoUrl: videoPath ? '' : videoUrl || videoUrlInput.trim() }
          : {}

      if (isEdit && id) {
        return updateFacebookPost(id, {
          pageId,
          pageName,
          postType,
          message,
          firstComment,
          ...(postType === 'reel' ? videoFields : { images }),
          scheduledAt: mode === 'schedule' ? scheduledIso : null,
        })
      }
      return createFacebookPost({
        facebookAccountId: accountId,
        pageId,
        pageName,
        postType,
        message,
        firstComment,
        ...(postType === 'reel' ? videoFields : { images }),
        ...(mode === 'schedule' && scheduledIso ? { scheduledAt: scheduledIso } : {}),
        ...(mode === 'publish' ? { publishNow: true } : {}),
      })
    },
    onSuccess: () => {
      if (mode === 'publish') notify.success('Đã đăng bài lên Facebook')
      else if (mode === 'schedule') notify.success('Đã lên lịch đăng bài')
      else notify.success(isEdit ? 'Đã lưu thay đổi' : 'Đã lưu bài nháp')
      navigate('/facebook-posts')
    },
    onError: (error) => notify.apiError(error, 'Lưu bài thất bại'),
  })

  const hasVideo = Boolean(videoPath || videoUrl || videoUrlInput.trim())

  const validate = (): boolean => {
    if (!accountId) return notifyFalse('Vui lòng chọn tài khoản Facebook')
    if (!pageId) return notifyFalse('Vui lòng chọn Page')
    if (postType === 'reel') {
      if (!hasVideo) return notifyFalse('Reel cần một video (tải lên hoặc URL)')
    } else if (!message.trim() && images.length === 0) {
      return notifyFalse('Bài viết cần nội dung hoặc ít nhất 1 ảnh')
    }
    if (mode === 'schedule') {
      if (!scheduledAt) return notifyFalse('Vui lòng chọn thời gian đăng')
      if (new Date(scheduledAt).getTime() < Date.now() + MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000) {
        return notifyFalse(`Thời gian đăng phải cách hiện tại ít nhất ${MIN_SCHEDULE_LEAD_MINUTES} phút`)
      }
    }
    return true
  }

  const submit = useCallback(() => {
    if (!validate()) return
    saveMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountId,
    pageId,
    postType,
    message,
    images,
    hasVideo,
    mode,
    scheduledAt,
    saveMutation,
  ])

  return {
    isEdit,
    isLoadingDetail: isEdit && isLoadingDetail,
    // selections
    accounts,
    accountId,
    handleAccountChange,
    selectedAccount,
    pages,
    pageId,
    setPageId,
    selectedPage,
    isLoadingPages,
    refetchPages,
    // type & content
    postType,
    setPostType,
    message,
    setMessage,
    firstComment,
    setFirstComment,
    generateComment,
    isGeneratingComment: generateCommentMutation.isPending,
    // images
    images,
    addImages,
    removeImage,
    isUploadingImages: uploadImagesMutation.isPending,
    // video
    videoPath,
    videoUrl,
    videoUrlInput,
    setVideoUrlInput,
    applyVideoUrl,
    addVideo,
    removeVideo,
    isUploadingVideo: uploadVideoMutation.isPending,
    hasVideo,
    // mode + schedule
    mode,
    setMode,
    scheduledAt,
    setScheduledAt,
    minScheduleLocalValue,
    // submit
    submit,
    isSubmitting: saveMutation.isPending,
    cancel: () => navigate('/facebook-posts'),
  }
}

/** Helper: bắn toast cảnh báo rồi trả false (gọn cho validate). */
const notifyFalse = (msg: string): false => {
  notify.warning(msg)
  return false
}
