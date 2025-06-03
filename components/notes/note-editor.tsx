"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { validateNoteContent } from "@/lib/utils/validation"
import { PenTool, Save } from "lucide-react"
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          {activeContext ? `Writing in ${activeContext.name}` : "Select a context"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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
          className="leading-relaxed custom-scrollbar"
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content.length > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {content.length} characters
                </Badge>
                {content.length > 1000 && (
                  <Badge variant="outline" className="text-xs text-amber-600">
                    Long note
                  </Badge>
                )}
              </>
            )}
          </div>

          <Button onClick={handleSave} disabled={!canSave} size="sm">
            {saving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
