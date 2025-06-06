"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
}

export function ResponsiveWrapper({ children, className, maxWidth = "2xl", padding = "md" }: ResponsiveWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  }

  const paddingClasses = {
    none: "",
    sm: "px-3 sm:px-4",
    md: "px-3 sm:px-4 lg:px-6",
    lg: "px-4 sm:px-6 lg:px-8",
  }

  return (
    <div className={cn("w-full mx-auto", maxWidthClasses[maxWidth], paddingClasses[padding], className)}>
      {children}
    </div>
  )
}
