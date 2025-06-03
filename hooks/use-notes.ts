"use client"

import { useState, useEffect } from "react"
import { NotesService } from "@/lib/services/notes.service"
import { AuthService } from "@/lib/services/auth.service"
import type { Note, NotesState } from "@/lib/types"

export function useNotes() {
  const [state, setState] = useState<NotesState>({
    contexts: [],
    notes: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      // Load contexts
      const { data: contextsData, error: contextsError } = await NotesService.getContexts()

      if (contextsError) throw contextsError

      let contexts = contextsData || []

      // Create default contexts if none exist
      if (contexts.length === 0) {
        const { user } = await AuthService.getCurrentUser()
        if (user) {
          const { data: defaultContexts } = await NotesService.createDefaultContexts(user.id)
          contexts = defaultContexts || []
        }
      }

      // Load notes
      const { data: notesData, error: notesError } = await NotesService.getNotes()

      if (notesError) throw notesError

      setState((prev) => ({
        ...prev,
        contexts,
        notes: notesData || [],
        loading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred",
        loading: false,
      }))
    }
  }

  const addContext = async (name: string, userId: string) => {
    try {
      const { data: newContext, error } = await NotesService.createContext({ name, userId })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        contexts: [...prev.contexts, newContext!],
      }))

      return newContext!
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add context"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const updateContext = async (contextId: string, name: string) => {
    try {
      const { data: updatedContext, error } = await NotesService.updateContext(contextId, name)

      if (error) throw error

      setState((prev) => ({
        ...prev,
        contexts: prev.contexts.map((c) => (c.id === contextId ? updatedContext! : c)),
      }))

      return updatedContext!
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update context"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const removeContext = async (contextId: string) => {
    try {
      const { error } = await NotesService.deleteContext(contextId)

      if (error) throw error

      setState((prev) => ({
        ...prev,
        contexts: prev.contexts.filter((c) => c.id !== contextId),
        notes: prev.notes.filter((n) => n.context_id !== contextId),
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove context"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const addNote = async (contextId: string, title: string, content: string, userId: string) => {
    try {
      const { data: newNote, error } = await NotesService.createNote({ contextId, title, content, userId })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        notes: [newNote!, ...prev.notes],
      }))

      return newNote!
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add note"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const updateNote = async (noteId: string, title: string, content: string) => {
    try {
      const { data: updatedNote, error } = await NotesService.updateNote({ noteId, title, content })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((note) => (note.id === noteId ? updatedNote! : note)),
      }))

      return updatedNote!
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update note"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await NotesService.deleteNote(noteId)

      if (error) throw error

      setState((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== noteId),
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete note"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }

  const getNotesForContext = (contextId: string): Note[] => {
    return state.notes.filter((note) => note.context_id === contextId)
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return {
    ...state,
    addContext,
    updateContext,
    removeContext,
    addNote,
    updateNote,
    deleteNote,
    getNotesForContext,
    refreshData: loadData,
    clearError,
  }
}
