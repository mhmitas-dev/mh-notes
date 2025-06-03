"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { NoteEditor } from "@/components/notes/note-editor"
import { NotesList } from "@/components/notes/notes-list"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { useNotes } from "@/hooks/use-notes"

export default function HomePage() {
  const { user, loading: authLoading, signUp, signIn, signInWithGoogle, signOut } = useAuth()
  const {
    contexts,
    notes,
    loading: notesLoading,
    error,
    addContext,
    removeContext,
    addNote,
    updateNote,
    deleteNote,
    getNotesForContext,
    refreshData,
    clearError,
  } = useNotes()

  const [activeContextId, setActiveContextId] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Set active context when contexts load
  useState(() => {
    if (contexts.length > 0 && !activeContextId) {
      setActiveContextId(contexts[0].id)
    }
  })

  const activeContext = contexts.find((c) => c.id === activeContextId)
  const contextNotes = activeContextId ? getNotesForContext(activeContextId) : []

  const handleAddContext = async (name: string) => {
    if (!user) return

    setSaving(true)
    try {
      const newContext = await addContext(name, user.id)
      setActiveContextId(newContext.id)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveContext = async (contextId: string) => {
    if (contexts.length <= 1) return

    setSaving(true)
    try {
      await removeContext(contextId)
      if (activeContextId === contextId) {
        const remainingContexts = contexts.filter((c) => c.id !== contextId)
        setActiveContextId(remainingContexts[0]?.id || "")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNote = async (content: string) => {
    if (!activeContextId || !user) return

    setSaving(true)
    try {
      await addNote(activeContextId, content, user.id)
    } finally {
      setSaving(false)
    }
  }

  const handleEditNote = async (noteId: string, content: string) => {
    setSaving(true)
    try {
      await updateNote(noteId, content)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    setSaving(true)
    try {
      await deleteNote(noteId)
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = () => {
    clearError()
    refreshData()
  }

  const handleSignOut = async () => {
    await signOut()
    setActiveContextId("")
    setMobileMenuOpen(false)
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#001e2b] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#38bdf8]">
          <LoadingSpinner size="lg" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  // Authentication required
  if (!user) {
    return (
      <AuthForm
        onSignUp={({ email, password }) => signUp(email, password)}
        onSignIn={({ email, password }) => signIn(email, password)}
        onGoogleSignIn={signInWithGoogle}
      />
    )
  }

  // Notes loading state
  if (notesLoading) {
    return (
      <div className="min-h-screen bg-[#001e2b] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#38bdf8]">
          <LoadingSpinner size="lg" />
          <span className="text-lg">Loading your notes...</span>
        </div>
      </div>
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-[#001e2b] text-[#f8fafc]">
      <Header
        user={user}
        error={error}
        onRefresh={handleRefresh}
        onSignOut={handleSignOut}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar
            contexts={contexts}
            activeContextId={activeContextId}
            user={user}
            saving={saving}
            onContextSelect={setActiveContextId}
            onContextAdd={handleAddContext}
            onContextRemove={handleRemoveContext}
          />

          <div className="flex-1">
            <div className="bg-[#112733] rounded-lg border border-[#1e3a47] shadow-md overflow-hidden">
              <div className="p-4 border-b border-[#1e3a47]">
                <h2 className="text-lg font-medium text-[#f8fafc]">
                  {activeContext ? activeContext.name : "Select a context"}
                </h2>
              </div>

              <NoteEditor activeContext={activeContext} user={user} saving={saving} onSave={handleSaveNote} />

              <div className="p-4">
                <NotesList
                  notes={contextNotes}
                  activeContext={activeContext}
                  saving={saving}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
