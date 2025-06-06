"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileContextSelector } from "@/components/layout/mobile-context-selector"
import { ResponsiveWrapper } from "@/components/layout/responsive-wrapper"
import { DebugInfo } from "@/components/layout/debug-info"
import { NoteEditor } from "@/components/notes/note-editor"
import { NotesList } from "@/components/notes/notes-list"
import { ContextAddModal } from "@/components/context/context-add-modal"
import { ContextManagementModal } from "@/components/context/context-management-modal"
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
  const [showAddContextModal, setShowAddContextModal] = useState(false)
  const [showContextManagementModal, setShowContextManagementModal] = useState(false)
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

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = () => setMobileMenuOpen(false)
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

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

  const handleMoveNoteToContext = async (noteId: string, contextId: string) => {
    setSaving(true)
    try {
      // Find the note to get its current data
      const noteToMove = notes.find((note) => note.id === noteId)
      if (!noteToMove || !user) return

      // Create a new note in the target context
      await addNote(contextId, noteToMove.title, noteToMove.content, user.id)

      // Delete the original note
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
      <div className="min-h-screen-mobile bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <LoadingSpinner size="lg" />
          <span className="text-responsive-lg font-medium">Loading...</span>
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
      <div className="min-h-screen-mobile bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <LoadingSpinner size="lg" />
          <span className="text-responsive-lg font-medium">Loading your notes...</span>
        </div>
      </div>
    )
  }

  // Main application
  return (
    <div className="min-h-screen-mobile bg-background">
      <Header
        user={user}
        error={error}
        onRefresh={handleRefresh}
        onSignOut={handleSignOut}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <ResponsiveWrapper padding="md">
        <div className="py-3 sm:py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 xl:gap-8 items-start">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block sticky-desktop">
              <Sidebar
                contexts={contexts}
                activeContextId={activeContextId}
                user={user}
                saving={saving}
                onContextSelect={setActiveContextId}
                onAddContextClick={() => setShowAddContextModal(true)}
                onManageContextsClick={() => setShowContextManagementModal(true)}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 space-mobile">
              {/* Mobile Context Selector */}
              <div className="lg:hidden">
                <MobileContextSelector
                  contexts={contexts}
                  activeContextId={activeContextId}
                  onContextSelect={setActiveContextId}
                  onAddContextClick={() => setShowAddContextModal(true)}
                  onManageContextsClick={() => setShowContextManagementModal(true)}
                />
              </div>

              {/* Note Editor */}
              <NoteEditor activeContext={activeContext} user={user} saving={saving} onSave={handleSaveNote} />

              {/* Notes List */}
              <NotesList
                notes={contextNotes}
                contexts={contexts}
                activeContext={activeContext}
                saving={saving}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onMoveNoteToContext={handleMoveNoteToContext}
              />
            </div>
          </div>
        </div>
      </ResponsiveWrapper>

      {/* Add Context Modal */}
      <ContextAddModal
        open={showAddContextModal}
        onOpenChange={setShowAddContextModal}
        user={user}
        saving={saving}
        onContextAdd={handleAddContext}
      />

      {/* Context Management Modal */}
      <ContextManagementModal
        open={showContextManagementModal}
        onOpenChange={setShowContextManagementModal}
        contexts={contexts}
        saving={saving}
        onContextUpdate={handleUpdateContext}
        onContextRemove={handleRemoveContext}
      />

      {/* Debug Info - Only in development */}
      {process.env.NODE_ENV === "development" && <DebugInfo contexts={contexts} activeContextId={activeContextId} />}
    </div>
  )
}
