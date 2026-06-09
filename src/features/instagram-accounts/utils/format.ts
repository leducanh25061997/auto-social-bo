import { format, parseISO } from 'date-fns'

/** Định dạng ISO -> dd/MM/yyyy HH:mm. Trả về '—' nếu thiếu/sai. */
export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'dd/MM/yyyy HH:mm')
  } catch {
    return '—'
  }
}
