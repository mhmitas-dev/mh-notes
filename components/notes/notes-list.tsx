"use client"

import { NoteItem } from "./note-item"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, BookOpen } from "lucide-react"
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
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">Select a context</h3>
          <p className="text-muted-foreground text-center max-w-sm text-sm sm:text-base">
            Choose a context from the sidebar to view and create notes
          </p>
        </CardContent>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-center max-w-sm text-sm sm:text-base">
            Start writing in the editor above to create your first note in{" "}
            <Badge variant="secondary" className="mx-1 text-xs px-1.5 py-0.5">
              {activeContext.name}
            </Badge>
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalCharacters = notes.reduce((acc, note) => acc + note.content.length, 0)
  const longNotesCount = notes.filter((note) => note.content.length > 300).length

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Notes in {activeContext.name}
          </h3>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Badge>
          {longNotesCount > 0 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-amber-600">
              {longNotesCount} long
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
          {totalCharacters.toLocaleString()} chars
        </Badge>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {notes.map((note, index) => (
          <div key={note.id}>
            <NoteItem note={note} saving={saving} onEdit={onEditNote} onDelete={onDeleteNote} />
            {index < notes.length - 1 && <div className="h-px bg-border my-2 sm:my-3" />}
          </div>
        ))}
      </div>
    </div>
  )
}
