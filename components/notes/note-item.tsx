"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, isEdited } from "@/lib/utils/date"
import { validateNoteTitle, validateNoteContent } from "@/lib/utils/validation"
import { Edit, Trash2, Save, X, ChevronDown, ChevronUp, MoreVertical, FolderOpen } from "lucide-react"
import { NOTE_DISPLAY } from "@/lib/constants"
import type { Note, Context } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useMobile } from "@/hooks/use-mobile"
import MarkdownRender from "../shared/MarkdownRender"

interface NoteItemProps {
  note: Note
  contexts: Context[]
  activeContext: Context | undefined
  saving: boolean
  onEdit: (noteId: string, title: string, content: string) => Promise<void>
  onDelete: (noteId: string) => Promise<void>
  onMoveToContext: (noteId: string, contextId: string) => Promise<void>
}

export function NoteItem({ note, contexts, activeContext, saving, onEdit, onDelete, onMoveToContext }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const isMobile = useMobile()
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const isLongNote = note.content.length > NOTE_DISPLAY.LONG_NOTE_THRESHOLD
  const shouldShowExpandButton = isLongNote && !isEditing

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false)
      }
    }

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showContextMenu])

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsExpanded(true) // Always expand when editing
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSaveEdit = async () => {
    if (!validateNoteTitle(editTitle) || !validateNoteContent(editContent)) return

    try {
      await onEdit(note.id, editTitle.trim(), editContent.trim())
      setIsEditing(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(note.id)
      setShowDeleteAlert(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleMoveToContext = async (contextId: string) => {
    try {
      await onMoveToContext(note.id, contextId)
      setShowContextMenu(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      if (canSave) {
        handleSaveEdit()
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  const canSave = validateNoteTitle(editTitle) && validateNoteContent(editContent) && !isEditing
  const hasChanges = editTitle.trim() !== note.title.trim() || editContent.trim() !== note.content.trim()

  const getDisplayContent = () => {
    if (isEditing || isExpanded) return note.content

    const lines = note.content.split("\n")
    if (lines.length <= NOTE_DISPLAY.PREVIEW_LINES) return note.content

    return lines.slice(0, NOTE_DISPLAY.PREVIEW_LINES).join("\n")
  }

  return (
    <Card className="note-item-enter transition-all duration-200 hover:shadow-md shadow-sm">
      <CardContent className="p-3 sm:p-4">
        {isEditing ? (
          <div className="space-y-3 sm:space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Note title..."
              disabled={saving}
              className="text-sm sm:text-base font-medium"
              maxLength={100}
            />

            <AutoResizeTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Edit your note content... (Ctrl+Enter to save, Esc to cancel)"
              minHeight={80}
              maxHeight={400}
              disabled={saving}
              className="text-sm leading-relaxed custom-scrollbar px-3 py-2"
              autoFocus
            />

            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {editTitle.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Title: {editTitle.length}/100
                  </Badge>
                )}
                {editContent.length > 0 && (
                  <>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {editContent.length} chars
                    </Badge>
                    {hasChanges && (
                      <Badge variant="outline" className="text-xs text-primary px-1.5 py-0.5">
                        Modified
                      </Badge>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  disabled={!canSave}
                  className={cn("h-7 sm:h-8 px-2 sm:px-3 text-xs", hasChanges ? "bg-primary hover:bg-primary/90" : "")}
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="group">
            {/* Note Title - Always Visible */}
            <div className="mb-2 sm:mb-3 flex justify-between items-start">
              <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">{note.title}</h3>

              {/* Mobile Context Menu */}
              {isMobile && (
                <div className="relative" ref={contextMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setShowContextMenu(!showContextMenu)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {showContextMenu && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-md shadow-md py-1 w-48">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Note Actions</div>
                      <div className="h-px bg-border my-1" />
                      <button
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                        onClick={handleStartEdit}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Note
                      </button>
                      <button
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowDeleteAlert(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Delete Note
                      </button>

                      {contexts.length > 1 && (
                        <>
                          <div className="h-px bg-border my-1" />
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Move to Context</div>
                          {contexts
                            .filter((context) => context.id !== note.context_id)
                            .map((context) => (
                              <button
                                key={context.id}
                                className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                                onClick={() => handleMoveToContext(context.id)}
                              >
                                <FolderOpen className="mr-2 h-4 w-4" />
                                {context.name}
                              </button>
                            ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Dropdown Menu */}
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleStartEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Note
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteAlert(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Note
                    </DropdownMenuItem>

                    {contexts.length > 1 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Move to Context</div>
                        {contexts
                          .filter((context) => context.id !== note.context_id)
                          .map((context) => (
                            <DropdownMenuItem key={context.id} onClick={() => handleMoveToContext(context.id)}>
                              <FolderOpen className="mr-2 h-4 w-4" />
                              {context.name}
                            </DropdownMenuItem>
                          ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Note Content - Expandable */}
            <div className="relative">
              <div
                className={cn(
                  "whitespace-pre-wrap text-foreground text-sm leading-relaxed transition-all duration-300 prose",
                  !isExpanded && isLongNote && "overflow-hidden",
                )}
                style={{
                  maxHeight: !isExpanded && isLongNote ? `${NOTE_DISPLAY.COLLAPSED_HEIGHT}px` : "none",
                }}
              >
                <MarkdownRender markdown={getDisplayContent()} />
              </div>

              {/* Fade overlay for collapsed long notes */}
              {!isExpanded && isLongNote && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
              )}
            </div>

            {/* Expand/Collapse Button */}
            {shouldShowExpandButton && (
              <div className="mt-2 sm:mt-3">
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show more
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Footer with metadata and actions */}
            <div className="flex justify-between items-center pt-2 sm:pt-3 mt-3 sm:mt-4 border-t border-border gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {formatDate(note.created_at)}
                  </Badge>
                  {isEdited(note.created_at, note.updated_at) && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      Edited
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground">
                    {note.content.length} chars
                  </Badge>
                </div>
              </div>

              {/* Desktop action buttons */}
              {!isMobile && (
                <div className="flex gap-1 sm:gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    onClick={handleStartEdit}
                    disabled={saving}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary h-7 sm:h-8 px-2 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    onClick={() => setShowDeleteAlert(true)}
                    disabled={saving}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive h-7 sm:h-8 px-2 text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              )}

              {/* Mobile action buttons - fixed at bottom */}
              {isMobile && (
                <div className="flex gap-1">
                  <Button
                    onClick={handleStartEdit}
                    disabled={saving}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
