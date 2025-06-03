"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { validateNoteContent } from "@/lib/utils/validation"
import type { Context, User } from "@/lib/types"

interface NoteEditorProps {
  activeContext: Context | undefined
  user: User | null
  saving: boolean
  onSave: (content: string) => Promise<void>
}

export function NoteEditor({ activeContext, user, saving, onSave }: NoteEditorProps) {
  const [content, setContent] = useState("")

  const handleSave = async () => {
    if (!validateNoteContent(content) || !activeContext || !user) return

    try {
      await onSave(content.trim())
      setContent("")
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      if (canSave) {
        handleSave()
      }
    }
  }

  const isDisabled = saving || !activeContext || !user
  const canSave = validateNoteContent(content) && !isDisabled

  return (
    <div className="p-4 border-b border-[#1e3a47]">
      <div className="space-y-3">
        <AutoResizeTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeContext ? "Write your note here... (Ctrl+Enter to save)" : "Select a context to start writing"
          }
          minHeight={120}
          maxHeight={500}
          disabled={isDisabled}
          className="text-sm leading-relaxed"
        />

        <div className="flex justify-between items-center">
          <div className="text-xs text-[#64748b]">
            {content.length > 0 && (
              <span>
                {content.length} characters
                {content.length > 1000 && <span className="ml-2 text-[#f59e0b]">• Long note</span>}
              </span>
            )}
          </div>

          <Button onClick={handleSave} disabled={!canSave} size="sm">
            {saving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
