"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { validateNoteTitle, validateNoteContent } from "@/lib/utils/validation"
import { PenTool, Save } from "lucide-react"
import { cn } from "@/lib/utils"
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
    <div className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10">
            <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
              {activeContext ? `Writing in ${activeContext.name}` : "Select a context"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {activeContext ? "Create a new note" : "Choose a context to start writing"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="note-title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeContext ? "Enter note title..." : "Select a context to start writing"}
            disabled={isDisabled}
            className={cn(
              "text-sm sm:text-base font-medium bg-background",
              "border-border/60 focus:border-primary/60 focus:ring-primary/20",
              "transition-colors duration-200",
            )}
            maxLength={100}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label htmlFor="note-content" className="text-sm font-medium text-foreground">
            Content
          </label>
          <AutoResizeTextarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeContext
                ? "Write your note content here...\n\nTip: Use Ctrl+Enter to save quickly"
                : "Select a context to start writing"
            }
            minHeight={120}
            maxHeight={400}
            disabled={isDisabled}
            className={cn(
              "leading-relaxed custom-scrollbar text-sm sm:text-base",
              "bg-background border-border/60 focus:border-primary/60 focus:ring-primary/20",
              "transition-colors duration-200 resize-none",
              "px-3 py-3 sm:px-4 sm:py-3",
            )}
          />
        </div>

        {/* Footer with stats and save button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-2">
          {/* Character counts and indicators */}
          <div className="flex items-center gap-2 flex-wrap">
            {title.length > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-2 py-1 font-normal",
                  title.length > 80 && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                )}
              >
                Title: {title.length}/100
              </Badge>
            )}
            {content.length > 0 && (
              <>
                <Badge variant="outline" className="text-xs px-2 py-1 font-normal">
                  {content.length} characters
                </Badge>
                {content.split("\n").length > 1 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 font-normal">
                    {content.split("\n").length} lines
                  </Badge>
                )}
                {content.length > 1000 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 font-normal text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-600"
                  >
                    Long note
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!canSave}
            size="sm"
            className={cn(
              "h-9 px-4 text-sm font-medium min-w-[100px]",
              "transition-all duration-200",
              canSave && "shadow-sm hover:shadow-md",
            )}
          >
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
      </div>
    </div>
  )
}
