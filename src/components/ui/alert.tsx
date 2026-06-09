import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground [&>svg]:text-foreground',
        destructive:
          'border-destructive/50 bg-destructive/5 text-destructive [&>svg]:text-destructive',
        success:
          'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-500',
        warning:
          'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-500',
        info: 'border-sky-500/40 bg-sky-500/5 text-sky-600 dark:text-sky-400 [&>svg]:text-sky-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

/** Icon mặc định theo từng variant — đảm bảo dùng nhất quán toàn dự án. */
export const ALERT_ICONS: Record<AlertVariant, LucideIcon> = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
}

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

interface AppAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title?: React.ReactNode
  /** Tự render icon mặc định theo variant. Đặt `false` để ẩn. */
  withIcon?: boolean
}

/**
 * Wrapper tiện dụng: tự gắn icon mặc định theo variant + title + nội dung.
 * Đây là cách DÙNG CHUNG khuyến nghị cho cả dự án; vẫn có thể dùng các primitive
 * `Alert`/`AlertTitle`/`AlertDescription` khi cần bố cục tuỳ biến.
 *
 * @example
 * <AppAlert variant="success" title="Thành công">Đã lưu thay đổi.</AppAlert>
 */
const AppAlert = ({
  variant = 'default',
  title,
  withIcon = true,
  className,
  children,
  ...props
}: AppAlertProps) => {
  const Icon = ALERT_ICONS[variant]
  return (
    <Alert variant={variant} className={className} {...props}>
      {withIcon && <Icon />}
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  )
}

export { Alert, AlertTitle, AlertDescription, AppAlert, alertVariants }
