"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, FolderOpen } from "lucide-react"
import { validateContextName } from "@/lib/utils/validation"
import type { User } from "@/lib/types"

interface ContextAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  saving: boolean
  onContextAdd: (name: string) => Promise<void>
}

export function ContextAddModal({ open, onOpenChange, user, saving, onContextAdd }: ContextAddModalProps) {
  const [contextName, setContextName] = useState("")

  const handleAddContext = async () => {
    if (!validateContextName(contextName) || !user) return

    try {
      await onContextAdd(contextName.trim())
      setContextName("")
      onOpenChange(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && validateContextName(contextName) && !saving) {
      e.preventDefault()
      handleAddContext()
    }
  }

  const handleClose = () => {
    setContextName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            Add New Context
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Create a new context to organize your notes</p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="context-name" className="text-sm font-medium">
              Context Name
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                <FolderOpen className="w-4 h-4 text-primary" />
              </div>
              <Input
                id="context-name"
                value={contextName}
                onChange={(e) => setContextName(e.target.value)}
                placeholder="Enter context name..."
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={saving}
                className="flex-1"
                maxLength={50}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Examples: Work, Personal, Projects, Ideas, Goals</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleClose} variant="outline" disabled={saving} className="px-4">
              Cancel
            </Button>
            <Button onClick={handleAddContext} disabled={!validateContextName(contextName) || saving} className="px-4">
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Context
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
