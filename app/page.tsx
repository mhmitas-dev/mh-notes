"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileContextSelector } from "@/components/layout/mobile-context-selector"
import { DebugInfo } from "@/components/layout/debug-info"
import { NoteEditor } from "@/components/notes/note-editor"
import { NotesList } from "@/components/notes/notes-list"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { useNotes } from "@/hooks/use-notes"
import { useMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const { user, loading: authLoading, signUp, signIn, signInWithGoogle, signOut } = useAuth()
  const {
    contexts,
    notes,
    loading: notesLoading,
    error,
    addContext,
    updateContext,
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
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const isMobile = useMobile()
  const [authInitialized, setAuthInitialized] = useState(false)

  // Load data when user authentication state changes
  useEffect(() => {
    if (user && !authInitialized) {
      // User is authenticated for the first time, load their data
      refreshData(user.id)
      setAuthInitialized(true)
    } else if (!user && authInitialized) {
      // User signed out, reset the flag
      setAuthInitialized(false)
    }
  }, [user, authInitialized, refreshData])

  // Set active context when contexts load
  useEffect(() => {
    if (contexts.length > 0 && !activeContextId) {
      setActiveContextId(contexts[0].id)
    }
  }, [contexts, activeContextId])

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

  const handleUpdateContext = async (contextId: string, name: string) => {
    setSaving(true)
    try {
      await updateContext(contextId, name)
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

  const handleSaveNote = async (title: string, content: string) => {
    if (!activeContextId || !user) return

    setSaving(true)
    try {
      await addNote(activeContextId, title, content, user.id)
    } finally {
      setSaving(false)
    }
  }

  const handleEditNote = async (noteId: string, title: string, content: string) => {
    setSaving(true)
    try {
      await updateNote(noteId, title, content)
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
    if (user) {
      refreshData(user.id)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setActiveContextId("")
    setMobileMenuOpen(false)
    setAuthInitialized(false)
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <LoadingSpinner size="lg" />
          <span className="text-lg font-medium">Loading...</span>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <LoadingSpinner size="lg" />
          <span className="text-lg font-medium">Loading your notes...</span>
        </div>
      </div>
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        error={error}
        onRefresh={handleRefresh}
        onSignOut={handleSignOut}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-20">
            <Sidebar
              contexts={contexts}
              activeContextId={activeContextId}
              user={user}
              saving={saving}
              onContextSelect={setActiveContextId}
              onContextAdd={handleAddContext}
              onContextUpdate={handleUpdateContext}
              onContextRemove={handleRemoveContext}
            />
          </div>

          <div className="flex-1 min-w-0 *:mb-5">
            {/* Mobile Context Selector */}
            <div className="lg:hidden">
              <MobileContextSelector
                contexts={contexts}
                activeContextId={activeContextId}
                onContextSelect={setActiveContextId}
                onAddContext={() => setShowNewContextInput(true)}
              />
            </div>

            <NoteEditor activeContext={activeContext} user={user} saving={saving} onSave={handleSaveNote} />

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

      {/* Debug Info - Only in development */}
      {process.env.NODE_ENV === "development" && <DebugInfo contexts={contexts} activeContextId={activeContextId} />}
    </div>
  )
}
