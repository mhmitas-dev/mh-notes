"use client"

import { NoteItem } from "./note-item"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus } from "lucide-react"
import type { Note, Context } from "@/lib/types"

interface NotesListProps {
  notes: Note[]
  activeContext: Context | undefined
  saving: boolean
  onEditNote: (noteId: string, content: string) => Promise<void>
  onDeleteNote: (noteId: string) => Promise<void>
}

export function NotesList({ notes, activeContext, saving, onEditNote, onDeleteNote }: NotesListProps) {
  if (!activeContext) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Select a context</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Choose a context from the sidebar to view and create notes
          </p>
        </CardContent>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Start writing in the editor above to create your first note in{" "}
            <Badge variant="secondary" className="mx-1">
              {activeContext.name}
            </Badge>
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalCharacters = notes.reduce((acc, note) => acc + note.content.length, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Notes in {activeContext.name}</h3>
          <Badge variant="secondary">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Badge>
        </div>
        <Badge variant="outline" className="text-xs">
          {totalCharacters.toLocaleString()} characters total
        </Badge>
      </div>

      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={note.id}>
            <NoteItem note={note} saving={saving} onEdit={onEditNote} onDelete={onDeleteNote} />
            {index < notes.length - 1 && <div className="h-px bg-border my-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}
