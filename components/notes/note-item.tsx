"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, isEdited } from "@/lib/utils/date"
import { validateNoteTitle, validateNoteContent } from "@/lib/utils/validation"
import { Edit, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react"
import { NOTE_DISPLAY } from "@/lib/constants"
import type { Note } from "@/lib/types"

interface NoteItemProps {
  note: Note
  saving: boolean
  onEdit: (noteId: string, title: string, content: string) => Promise<void>
  onDelete: (noteId: string) => Promise<void>
}

export function NoteItem({ note, saving, onEdit, onDelete }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)

  const isLongNote = note.content.length > NOTE_DISPLAY.LONG_NOTE_THRESHOLD
  const shouldShowExpandButton = isLongNote && !isEditing

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
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await onDelete(note.id)
      } catch (error) {
        // Error is handled by parent component
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const canSave = validateNoteTitle(editTitle) && validateNoteContent(editContent) && !saving
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
            <div className="mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">{note.title}</h3>
            </div>

            {/* Note Content - Expandable */}
            <div className="relative">
              <div
                className={cn(
                  "whitespace-pre-wrap text-foreground text-sm leading-relaxed transition-all duration-300",
                  !isExpanded && isLongNote && "overflow-hidden",
                )}
                style={{
                  maxHeight: !isExpanded && isLongNote ? `${NOTE_DISPLAY.COLLAPSED_HEIGHT}px` : "none",
                }}
              >
                {getDisplayContent()}
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
                  onClick={handleDelete}
                  disabled={saving}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-7 sm:h-8 px-2 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
