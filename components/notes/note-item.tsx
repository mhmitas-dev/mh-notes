"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, isEdited } from "@/lib/utils/date"
import { validateNoteContent } from "@/lib/utils/validation"
import { Edit, Trash2, Save, X } from "lucide-react"
import type { Note } from "@/lib/types"

interface NoteItemProps {
  note: Note
  saving: boolean
  onEdit: (noteId: string, content: string) => Promise<void>
  onDelete: (noteId: string) => Promise<void>
}

export function NoteItem({ note, saving, onEdit, onDelete }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditContent(note.content)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(note.content)
  }

  const handleSaveEdit = async () => {
    if (!validateNoteContent(editContent)) return

    try {
      await onEdit(note.id, editContent.trim())
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const canSave = validateNoteContent(editContent) && !saving
  const hasChanges = editContent.trim() !== note.content.trim()

  return (
    <Card className="note-item-enter transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <AutoResizeTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Edit your note... (Ctrl+Enter to save, Esc to cancel)"
              minHeight={100}
              maxHeight={400}
              disabled={saving}
              className="text-sm leading-relaxed custom-scrollbar"
              autoFocus
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {editContent.length > 0 && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      {editContent.length} characters
                    </Badge>
                    {hasChanges && (
                      <Badge variant="outline" className="text-xs text-primary">
                        Modified
                      </Badge>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={saving}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  disabled={!canSave}
                  className={hasChanges ? "bg-primary hover:bg-primary/90" : ""}
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
            <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed mb-4">{note.content}</div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatDate(note.created_at)}
                  </Badge>
                  {isEdited(note.created_at, note.updated_at) && (
                    <Badge variant="secondary" className="text-xs">
                      Edited
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs w-fit">
                  {note.content.length} characters
                </Badge>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={handleStartEdit}
                  disabled={saving}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={saving}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
