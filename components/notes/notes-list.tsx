"use client"

import { NoteItem } from "./note-item"
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
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e3a47] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-[#94a3b8] text-lg font-medium">Select a context</p>
          <p className="text-[#64748b] text-sm mt-1">Choose a context from the sidebar to view and create notes</p>
        </div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e3a47] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-[#94a3b8] text-lg font-medium">No notes yet</p>
          <p className="text-[#64748b] text-sm mt-1">
            Start writing in the editor above to create your first note in{" "}
            <span className="text-[#38bdf8]">{activeContext.name}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#94a3b8]">
          {notes.length} {notes.length === 1 ? "note" : "notes"} in {activeContext.name}
        </h3>
        <div className="text-xs text-[#64748b]">
          Total: {notes.reduce((acc, note) => acc + note.content.length, 0)} characters
        </div>
      </div>

      {notes.map((note, index) => (
        <div key={note.id} className="relative">
          <NoteItem note={note} saving={saving} onEdit={onEditNote} onDelete={onDeleteNote} />
          {index < notes.length - 1 && (
            <div className="h-px bg-gradient-to-r from-transparent via-[#1e3a47] to-transparent my-4" />
          )}
        </div>
      ))}
    </div>
  )
}
