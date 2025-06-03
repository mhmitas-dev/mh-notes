"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/services/auth.service"
import type { User } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      if (initialized) return // Prevent re-initialization

      setLoading(true)
      try {
        const { session } = await AuthService.getSession()
        setUser(session?.user ?? null)
        setInitialized(true)
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!initialized) {
        setInitialized(true)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [initialized])

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signUp({ email, password })
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signIn({ email, password })
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      return await AuthService.signInWithGoogle()
    } finally {
      // Note: We don't set loading to false here because the page will redirect
      // and the component will unmount
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await AuthService.signOut()
      setInitialized(false) // Reset initialization flag
      return result
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    initialized,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }
}
