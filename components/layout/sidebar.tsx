"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { validateContextName } from "@/lib/utils/validation"
import { cn } from "@/lib/utils"
import type { Context, User } from "@/lib/types"

interface SidebarProps {
  contexts: Context[]
  activeContextId: string
  user: User | null
  saving: boolean
  onContextSelect: (contextId: string) => void
  onContextAdd: (name: string) => Promise<void>
  onContextRemove: (contextId: string) => Promise<void>
}

export function Sidebar({
  contexts,
  activeContextId,
  user,
  saving,
  onContextSelect,
  onContextAdd,
  onContextRemove,
}: SidebarProps) {
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [newContextName, setNewContextName] = useState("")

  const handleAddContext = async () => {
    if (!validateContextName(newContextName) || !user) return

    try {
      await onContextAdd(newContextName.trim())
      setNewContextName("")
      setShowNewContextInput(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddContext()
    } else if (e.key === "Escape") {
      setShowNewContextInput(false)
      setNewContextName("")
    }
  }

  const handleCancel = () => {
    setShowNewContextInput(false)
    setNewContextName("")
  }

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Contexts
            <Badge variant="secondary" className="ml-auto">
              {contexts.length}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-1">
            {contexts.map((context) => (
              <div key={context.id} className="relative group">
                <Button
                  onClick={() => onContextSelect(context.id)}
                  variant={activeContextId === context.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    activeContextId === context.id && "bg-secondary text-secondary-foreground",
                  )}
                  size="sm"
                >
                  <span className="truncate">{context.name}</span>
                </Button>

                {contexts.length > 1 && (
                  <Button
                    onClick={() => onContextRemove(context.id)}
                    disabled={saving}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add new context */}
          {showNewContextInput ? (
            <div className="space-y-2 pt-2 border-t border-border">
              <Input
                value={newContextName}
                onChange={(e) => setNewContextName(e.target.value)}
                placeholder="Context name"
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={saving}
                className="h-8"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddContext}
                  size="sm"
                  className="flex-1"
                  disabled={!validateContextName(newContextName) || saving}
                >
                  {saving ? <LoadingSpinner size="sm" /> : "Add"}
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline" className="flex-1" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowNewContextInput(true)}
              disabled={saving}
              variant="outline"
              size="sm"
              className="w-full mt-2 border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Context
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
