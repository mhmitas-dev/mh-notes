"use client"

import { useState, useEffect } from "react"
import { FolderOpen, ChevronDown, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Context } from "@/lib/types"

interface MobileContextSelectorProps {
  contexts: Context[]
  activeContextId: string
  onContextSelect: (contextId: string) => void
  onAddContext: () => void
  className?: string
}

export function MobileContextSelector({
  contexts,
  activeContextId,
  onContextSelect,
  onAddContext,
  className,
}: MobileContextSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const activeContext = contexts.find((c) => c.id === activeContextId)

  const filteredContexts = contexts.filter((context) => context.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleContextSelect = (contextId: string) => {
    onContextSelect(contextId)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleAddContext = () => {
    onAddContext()
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full justify-between h-12 px-4 text-left touch-manipulation"
        type="button"
      >
        <div className="flex items-center gap-3 min-w-0">
          <FolderOpen className="w-5 h-5 flex-shrink-0" />
          <span className="truncate text-base">{activeContext ? activeContext.name : "Select context..."}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="secondary" className="text-sm px-2 py-1">
            {contexts.length}
          </Badge>
          <ChevronDown className="h-5 w-5 opacity-50" />
        </div>
      </Button>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-lg animate-in slide-in-from-bottom-0 duration-300 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Select Context
              </h2>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contexts..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={false}
                />
              </div>
            </div>

            {/* Context List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {filteredContexts.map((context) => (
                    <Button
                      key={context.id}
                      onClick={() => handleContextSelect(context.id)}
                      variant={context.id === activeContextId ? "secondary" : "ghost"}
                      className="w-full justify-start h-14 px-4 text-left touch-manipulation"
                    >
                      <FolderOpen className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate flex-1 text-base">{context.name}</span>
                      {context.id === activeContextId && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Active
                        </Badge>
                      )}
                    </Button>
                  ))}
                  {filteredContexts.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No contexts found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Add Context Button */}
            <div className="p-4 border-t border-border">
              <Button onClick={handleAddContext} variant="outline" className="w-full h-12 touch-manipulation">
                <Plus className="w-4 h-4 mr-2" />
                Add New Context
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
