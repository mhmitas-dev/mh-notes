"use client"

import { NoteItem } from "./note-item"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Context } from "@/lib/types"

interface NotesListProps {
  notes: Note[]
  activeContext: Context | undefined
  saving: boolean
  onEditNote: (noteId: string, title: string, content: string) => Promise<void>
  onDeleteNote: (noteId: string) => Promise<void>
}

export function NotesList({ notes, activeContext, saving, onEditNote, onDeleteNote }: NotesListProps) {
  if (!activeContext) {
    return (
      <div className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Select a context</h3>
          <p className="text-muted-foreground text-center max-w-sm text-sm sm:text-base leading-relaxed">
            Choose a context from the sidebar to view and create notes
          </p>
        </div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-center max-w-sm text-sm sm:text-base leading-relaxed">
            Start writing in the editor above to create your first note in{" "}
            <Badge variant="secondary" className="mx-1 text-sm px-2 py-1 font-medium">
              {activeContext.name}
            </Badge>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            Notes in {activeContext.name}
          </h3>
          <Badge variant="secondary" className="text-xs px-2 py-1 font-medium">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Badge>
        </div>
      </div>

      {/* Notes grid/list */}
      <div className="space-y-4 sm:space-y-5">
        {notes.map((note, index) => (
          <div key={note.id} className={cn("transition-all duration-200")}>
            <NoteItem note={note} saving={saving} onEdit={onEditNote} onDelete={onDeleteNote} />
            {index < notes.length - 1 && (
              <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4 sm:my-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
