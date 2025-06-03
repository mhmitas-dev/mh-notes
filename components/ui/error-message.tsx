import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  className?: string
  variant?: "default" | "destructive"
}

export function ErrorMessage({ message, className, variant = "destructive" }: ErrorMessageProps) {
  const variantClasses = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", variantClasses[variant], className)}>
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  )
}
