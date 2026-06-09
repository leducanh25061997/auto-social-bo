import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  TOAST_ICONS,
  type ToastVariant,
} from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const { Icon, className } = TOAST_ICONS[(variant as ToastVariant) ?? 'default']
        return (
          <Toast key={id} variant={variant} {...props}>
            {/* Icon theo loại — đồng bộ màu với viền trái & AppAlert. */}
            <Icon className={cn('mt-0.5 size-5 shrink-0', className)} />
            <div className="grid flex-1 gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
