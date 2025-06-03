"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { validateNoteTitle, validateNoteContent } from "@/lib/utils/validation"
import { PenTool, Save } from "lucide-react"
import type { Context, User } from "@/lib/types"

interface NoteEditorProps {
  activeContext: Context | undefined
  user: User | null
  saving: boolean
  onSave: (title: string, content: string) => Promise<void>
}

export function NoteEditor({ activeContext, user, saving, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = async () => {
    if (!validateNoteTitle(title) || !validateNoteContent(content) || !activeContext || !user) return

    try {
      await onSave(title.trim(), content.trim())
      setTitle("")
      setContent("")
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      if (canSave) {
        handleSave()
      }
    }
  }

  const isDisabled = saving || !activeContext || !user
  const canSave = validateNoteTitle(title) && validateNoteContent(content) && !isDisabled

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">{activeContext ? `Writing in ${activeContext.name}` : "Select a context"}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeContext ? "Note title..." : "Select a context to start writing"}
            disabled={isDisabled}
            className="text-sm sm:text-base font-medium"
            maxLength={100}
          />

          <AutoResizeTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeContext
                ? "Write your note content here... (Ctrl+Enter to save)"
                : "Select a context to start writing"
            }
            minHeight={100}
            maxHeight={400}
            disabled={isDisabled}
            className="leading-relaxed custom-scrollbar text-sm sm:text-base px-3 py-2 sm:px-3 sm:py-2.5"
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {title.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                Title: {title.length}/100
              </Badge>
            )}
            {content.length > 0 && (
              <>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  Content: {content.length} chars
                </Badge>
                {content.length > 1000 && (
                  <Badge variant="outline" className="text-xs text-amber-600 px-1.5 py-0.5">
                    Long note
                  </Badge>
                )}
              </>
            )}
          </div>

          <Button onClick={handleSave} disabled={!canSave} size="sm" className="h-8 sm:h-9 px-3 sm:px-4 text-sm">
            {saving ? (
              <>
                <LoadingSpinner size="sm" className="mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Save Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
