"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Context } from "@/types/context" // Assuming Context is imported from a types file

interface DebugInfoProps {
  contexts: Context[]
  activeContextId: string
}

export function DebugInfo({ contexts, activeContextId }: DebugInfoProps) {
  const [showDebug, setShowDebug] = useState(false)
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    userAgent: "",
    touchSupport: false,
  })

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
        touchSupport: "ontouchstart" in window,
      })
    }

    updateScreenInfo()
    window.addEventListener("resize", updateScreenInfo)

    return () => window.removeEventListener("resize", updateScreenInfo)
  }, [])

  if (!showDebug) {
    return (
      <Button
        onClick={() => setShowDebug(true)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
      >
        Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg p-4 max-w-sm text-xs space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Debug Info</h3>
        <Button onClick={() => setShowDebug(false)} variant="ghost" size="sm">
          ×
        </Button>
      </div>
      <div className="space-y-1">
        <div>
          Screen: {screenInfo.width}×{screenInfo.height}
        </div>
        <div>Touch: {screenInfo.touchSupport ? "Yes" : "No"}</div>
        <div>Contexts: {contexts.length}</div>
        <div>Active: {activeContextId || "None"}</div>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {screenInfo.width < 640 ? "Mobile" : screenInfo.width < 1024 ? "Tablet" : "Desktop"}
          </Badge>
          {screenInfo.touchSupport && (
            <Badge variant="outline" className="text-xs">
              Touch
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
