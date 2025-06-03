"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Loader2, RefreshCw, Search, Menu, LogOut, Settings } from "lucide-react"
import { useNotes } from "./hooks/use-notes"
import { useAuth } from "./hooks/use-auth"

export default function NotesApp() {
  const { user, signOut } = useAuth()
  const {
    contexts,
    loading,
    error,
    addContext,
    removeContext,
    addNote,
    updateNote,
    deleteNote,
    getNotesForContext,
    refreshData,
  } = useNotes()

  const [activeContextId, setActiveContextId] = useState<string>("")
  const [newContextName, setNewContextName] = useState("")
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [currentNote, setCurrentNote] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Set active context when contexts load
  useEffect(() => {
    if (contexts.length > 0 && !activeContextId) {
      setActiveContextId(contexts[0].id)
    }
  }, [contexts, activeContextId])

  const activeContext = contexts.find((c) => c.id === activeContextId)
  const contextNotes = activeContextId ? getNotesForContext(activeContextId) : []

  const handleAddContext = async () => {
    if (newContextName.trim() && user) {
      try {
        setSaving(true)
        const newContext = await addContext(newContextName.trim(), user.id)
        setNewContextName("")
        setShowNewContextInput(false)
        setActiveContextId(newContext.id)
      } catch (err) {
        // Error is handled by the hook
      } finally {
        setSaving(false)
      }
    }
  }

  const handleRemoveContext = async (contextId: string) => {
    if (contexts.length > 1) {
      try {
        setSaving(true)
        await removeContext(contextId)
        if (activeContextId === contextId) {
          const remainingContexts = contexts.filter((c) => c.id !== contextId)
          setActiveContextId(remainingContexts[0]?.id || "")
        }
      } catch (err) {
        // Error is handled by the hook
      } finally {
        setSaving(false)
      }
    }
  }

  const handleSaveNote = async () => {
    if (currentNote.trim() && activeContextId && user) {
      try {
        setSaving(true)
        await addNote(activeContextId, currentNote.trim(), user.id)
        setCurrentNote("")
      } catch (err) {
        // Error is handled by the hook
      } finally {
        setSaving(false)
      }
    }
  }

  const handleStartEditing = (note: any) => {
    setEditingNoteId(note.id)
    setEditingContent(note.content)
  }

  const handleCancelEditing = () => {
    setEditingNoteId(null)
    setEditingContent("")
  }

  const handleSaveEdit = async () => {
    if (editingContent.trim() && editingNoteId) {
      try {
        setSaving(true)
        await updateNote(editingNoteId, editingContent.trim())
        setEditingNoteId(null)
        setEditingContent("")
      } catch (err) {
        // Error is handled by the hook
      } finally {
        setSaving(false)
      }
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      setSaving(true)
      await deleteNote(noteId)
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001e2b] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#38bdf8]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading your notes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#001e2b] text-[#f8fafc]">
      {/* Header */}
      <header className="bg-[#0c1c25] border-b border-[#1e3a47] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#38bdf8]">Notes</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {user && <span className="text-[#94a3b8] text-sm">{user.email}</span>}
                {error && <span className="text-[#ef4444] text-sm">⚠️ {error}</span>}
                <button
                  onClick={refreshData}
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Refresh data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Search notes"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {user && (
                  <Button
                    onClick={signOut}
                    variant="ghost"
                    size="sm"
                    className="text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e3a47]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c1c25] border-b border-[#1e3a47] px-4 py-2">
            <div className="flex flex-col space-y-2">
              {user && <span className="text-[#94a3b8] text-sm">{user.email}</span>}
              {error && <span className="text-[#ef4444] text-sm">⚠️ {error}</span>}
              <div className="flex space-x-2">
                <button
                  onClick={refreshData}
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Refresh data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Search notes"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              {user && (
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e3a47]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[#112733] rounded-lg border border-[#1e3a47] shadow-md overflow-hidden">
              <div className="p-4 border-b border-[#1e3a47]">
                <h2 className="text-lg font-medium text-[#f8fafc]">Contexts</h2>
              </div>
              <div className="p-2">
                <div className="space-y-1">
                  {contexts.map((context) => (
                    <div key={context.id} className="relative group">
                      <button
                        onClick={() => setActiveContextId(context.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeContextId === context.id
                            ? "bg-[#1e3a47] text-[#38bdf8]"
                            : "text-[#cbd5e1] hover:bg-[#1e3a47] hover:text-[#f8fafc]"
                        }`}
                      >
                        {context.name}
                      </button>
                      {contexts.length > 1 && (
                        <button
                          onClick={() => handleRemoveContext(context.id)}
                          disabled={saving}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#1e3a47] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new context */}
                {showNewContextInput ? (
                  <div className="mt-2 p-2">
                    <Input
                      value={newContextName}
                      onChange={(e) => setNewContextName(e.target.value)}
                      placeholder="Context name"
                      className="text-sm mb-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddContext()
                        if (e.key === "Escape") {
                          setShowNewContextInput(false)
                          setNewContextName("")
                        }
                      }}
                      autoFocus
                      disabled={saving}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddContext} size="sm" className="w-full" disabled={saving}>
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowNewContextInput(false)
                          setNewContextName("")
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewContextInput(true)}
                    disabled={saving}
                    className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-[#38bdf8] hover:bg-[#1e3a47] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Context
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-[#112733] rounded-lg border border-[#1e3a47] shadow-md overflow-hidden">
              <div className="p-4 border-b border-[#1e3a47]">
                <h2 className="text-lg font-medium text-[#f8fafc]">
                  {activeContext ? activeContext.name : "Select a context"}
                </h2>
              </div>

              {/* Note input area */}
              <div className="p-4 border-b border-[#1e3a47]">
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Write your note here..."
                  className="min-h-[120px] bg-[#0c1c25] border-[#1e3a47] resize-none text-[#f8fafc] placeholder-[#64748b] text-sm"
                  disabled={saving || !activeContext}
                />
                <div className="flex justify-end mt-3">
                  <Button onClick={handleSaveNote} disabled={!currentNote.trim() || saving || !activeContext}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Notes list */}
              <div className="p-4">
                {contextNotes.length > 0 ? (
                  <div className="space-y-4">
                    {contextNotes.map((note) => (
                      <div key={note.id} className="group">
                        <div className="bg-[#0c1c25] rounded-lg border border-[#1e3a47] overflow-hidden">
                          {editingNoteId === note.id ? (
                            // Edit mode
                            <div className="p-4">
                              <Textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="min-h-[100px] bg-[#001e2b] border-[#1e3a47] resize-none text-[#f8fafc] text-sm"
                                disabled={saving}
                              />
                              <div className="flex justify-end gap-2 mt-3">
                                <Button onClick={handleCancelEditing} variant="outline" size="sm" disabled={saving}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEdit} size="sm" disabled={!editingContent.trim() || saving}>
                                  {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div className="p-4">
                              <div className="whitespace-pre-wrap text-[#f8fafc] text-sm">{note.content}</div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1e3a47]">
                                <span className="text-xs text-[#64748b]">
                                  {new Date(note.created_at).toLocaleString()}
                                  {note.updated_at !== note.created_at && (
                                    <span className="ml-2 text-[#64748b]">(edited)</span>
                                  )}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStartEditing(note)}
                                    disabled={saving}
                                    className="text-[#38bdf8] hover:text-[#0ea5e9] text-xs transition-colors disabled:opacity-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    disabled={saving}
                                    className="text-[#ef4444] hover:text-[#dc2626] text-xs transition-colors disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeContext ? (
                  <div className="text-center py-8">
                    <p className="text-[#94a3b8]">No notes in {activeContext.name} yet.</p>
                    <p className="text-[#64748b] text-sm mt-1">Start writing above to add your first note!</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#94a3b8]">Select a context to view notes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
