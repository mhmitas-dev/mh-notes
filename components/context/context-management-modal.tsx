"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2, Save, X, FolderOpen, Settings } from "lucide-react"
import { validateContextName } from "@/lib/utils/validation"
import type { Context } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ContextManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contexts: Context[]
  saving: boolean
  onContextUpdate: (contextId: string, name: string) => Promise<void>
  onContextRemove: (contextId: string) => Promise<void>
}

export function ContextManagementModal({
  open,
  onOpenChange,
  contexts,
  saving,
  onContextUpdate,
  onContextRemove,
}: ContextManagementModalProps) {
  const [editingContextId, setEditingContextId] = useState<string | null>(null)
  const [editingContextName, setEditingContextName] = useState("")
  const [contextToDelete, setContextToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const filteredContexts = contexts.filter((context) => context.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleStartEditing = (context: Context) => {
    setEditingContextId(context.id)
    setEditingContextName(context.name)
  }

  const handleCancelEditing = () => {
    setEditingContextId(null)
    setEditingContextName("")
  }

  const handleSaveEditing = async () => {
    if (!editingContextId || !validateContextName(editingContextName)) return

    try {
      await onContextUpdate(editingContextId, editingContextName.trim())
      setEditingContextId(null)
      setEditingContextName("")
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleConfirmDelete = async () => {
    if (!contextToDelete) return

    try {
      await onContextRemove(contextToDelete)
      setContextToDelete(null)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    } else if (e.key === "Escape") {
      e.preventDefault()
      if (editingContextId) {
        handleCancelEditing()
      }
    }
  }

  const handleClose = () => {
    // Reset all editing states when closing
    setEditingContextId(null)
    setEditingContextName("")
    setSearchQuery("")
    onOpenChange(false)
  }

  const renderContextItem = (context: Context) => {
    if (editingContextId === context.id) {
      return (
        <div key={context.id} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            value={editingContextName}
            onChange={(e) => setEditingContextName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSaveEditing)}
            className="h-8 text-sm flex-1"
            autoFocus
            disabled={saving}
            placeholder="Context name"
          />
          <Button
            onClick={handleSaveEditing}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={!validateContextName(editingContextName) || saving}
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="h-3 h-3" />}
          </Button>
          <Button
            onClick={handleCancelEditing}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={saving}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return (
      <div
        key={context.id}
        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
            <FolderOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">{context.name}</h4>
            <p className="text-xs text-muted-foreground">Created {new Date(context.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            onClick={() => handleStartEditing(context)}
            disabled={saving || editingContextId !== null}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <Edit className="w-3 h-3" />
          </Button>
          {contexts.length > 1 && (
            <Button
              onClick={() => setContextToDelete(context.id)}
              disabled={saving || editingContextId !== null}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              Manage Contexts
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Edit and organize your note contexts</p>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4 sm:gap-6">
            {/* Stats */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {contexts.length} {contexts.length === 1 ? "context" : "contexts"}
              </Badge>
              {contexts.length >= 10 && (
                <Badge variant="outline" className="text-xs px-2 py-1 text-amber-600 border-amber-300">
                  Consider organizing your contexts
                </Badge>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search contexts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-3"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Contexts list with enhanced scrolling */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium text-foreground mb-3">Your Contexts</h4>
              {filteredContexts.length > 0 ? (
                <ScrollArea
                  ref={scrollAreaRef}
                  className="h-[calc(100%-2rem)] max-h-[400px] pr-2"
                  style={{ maxHeight: "min(400px, 50vh)" }}
                >
                  <div className="space-y-3 pb-2">{filteredContexts.map(renderContextItem)}</div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  {searchQuery ? (
                    <p className="text-sm text-muted-foreground">No contexts found for "{searchQuery}"</p>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                        <FolderOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No contexts yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Add your first context to get started</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="flex-shrink-0 pt-4 border-t border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                <p>Contexts help organize your notes by topic or project</p>
                {contexts.length > 1 && <p className="text-amber-600">⚠️ Deleting a context removes all its notes</p>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={contextToDelete !== null} onOpenChange={(open) => !open && setContextToDelete(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Delete Context</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this context? This action will permanently remove the context and all
              notes within it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={saving}
              className="bg-destructive hover:bg-destructive/90"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
