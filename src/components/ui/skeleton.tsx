import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Nền mờ + vệt sáng quét ngang (pseudo-element) tạo cảm giác đang tải mượt mà.
        'relative overflow-hidden rounded-md bg-primary/10',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
        "before:bg-gradient-to-r before:from-transparent before:via-primary/15 before:to-transparent before:content-['']",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
