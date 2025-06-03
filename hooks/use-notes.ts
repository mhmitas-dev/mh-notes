"use client"

import { useState, useEffect } from "react"
import { supabase, type Context, type Note } from "@/lib/supabase"
import { createDefaultContexts } from "./create-default-contexts"

export function useNotes() {
  const [contexts, setContexts] = useState<Context[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load contexts and notes on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load contexts
      const { data: contextsData, error: contextsError } = await supabase
        .from("contexts")
        .select("*")
        .order("created_at", { ascending: true })

      if (contextsError) throw contextsError

      // If no contexts exist and we have a user, create default ones
      if (!contextsData || contextsData.length === 0) {
        // We'll need to get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const defaultContexts = await createDefaultContexts(user.id)
          setContexts(defaultContexts || [])
        }
      } else {
        setContexts(contextsData || [])
      }

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false })

      if (notesError) throw notesError

      setNotes(notesData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Add user parameter to all database operations
  const addContext = async (name: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("contexts")
        .insert([{ name, user_id: userId }])
        .select()
        .single()

      if (error) throw error

      setContexts((prev) => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add context")
      throw err
    }
  }

  const removeContext = async (contextId: string) => {
    try {
      const { error } = await supabase.from("contexts").delete().eq("id", contextId)

      if (error) throw error

      setContexts((prev) => prev.filter((c) => c.id !== contextId))
      setNotes((prev) => prev.filter((n) => n.context_id !== contextId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove context")
      throw err
    }
  }

  const addNote = async (contextId: string, content: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ context_id: contextId, content, user_id: userId }])
        .select()
        .single()

      if (error) throw error

      setNotes((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note")
      throw err
    }
  }

  const updateNote = async (noteId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .select()
        .single()

      if (error) throw error

      setNotes((prev) => prev.map((note) => (note.id === noteId ? data : note)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note")
      throw err
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId)

      if (error) throw error

      setNotes((prev) => prev.filter((n) => n.id !== noteId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note")
      throw err
    }
  }

  const getNotesForContext = (contextId: string) => {
    return notes.filter((note) => note.context_id === contextId)
  }

  // Update the return object to include userId parameter
  return {
    contexts,
    notes,
    loading,
    error,
    addContext: (name: string, userId: string) => addContext(name, userId),
    removeContext,
    addNote: (contextId: string, content: string, userId: string) => addNote(contextId, content, userId),
    updateNote,
    deleteNote,
    getNotesForContext,
    refreshData: loadData,
  }
}
