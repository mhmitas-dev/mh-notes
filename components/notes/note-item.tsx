"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate, isEdited } from "@/lib/utils/date"
import { validateNoteContent } from "@/lib/utils/validation"
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
    <div className="bg-[#0c1c25] rounded-lg border border-[#1e3a47] overflow-hidden transition-all duration-200 hover:border-[#2d4a59]">
      {isEditing ? (
        <div className="p-4">
          <div className="space-y-3">
            <AutoResizeTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Edit your note... (Ctrl+Enter to save, Esc to cancel)"
              minHeight={100}
              maxHeight={400}
              disabled={saving}
              className="text-sm leading-relaxed"
              autoFocus
            />

            <div className="flex justify-between items-center">
              <div className="text-xs text-[#64748b]">
                {editContent.length > 0 && (
                  <span>
                    {editContent.length} characters
                    {hasChanges && <span className="ml-2 text-[#38bdf8]">• Modified</span>}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={saving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  disabled={!canSave}
                  className={hasChanges ? "bg-[#38bdf8] hover:bg-[#0ea5e9]" : ""}
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-1" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 group">
          <div className="whitespace-pre-wrap text-[#f8fafc] text-sm leading-relaxed mb-3">{note.content}</div>

          <div className="flex justify-between items-center pt-3 border-t border-[#1e3a47]">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#64748b]">
                {formatDate(note.created_at)}
                {isEdited(note.created_at, note.updated_at) && <span className="ml-2 text-[#94a3b8]">(edited)</span>}
              </span>
              <span className="text-xs text-[#64748b]">{note.content.length} characters</span>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleStartEdit}
                disabled={saving}
                className="text-[#38bdf8] hover:text-[#0ea5e9] text-xs font-medium transition-colors disabled:opacity-50 px-2 py-1 rounded hover:bg-[#1e3a47]"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="text-[#ef4444] hover:text-[#dc2626] text-xs font-medium transition-colors disabled:opacity-50 px-2 py-1 rounded hover:bg-[#1e3a47]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
