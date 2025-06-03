"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/services/auth.service"
import type { User, AuthFormData } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    AuthService.getSession().then(({ session }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (formData: AuthFormData) => {
    return AuthService.signUp(formData)
  }

  const signIn = async (formData: AuthFormData) => {
    return AuthService.signIn(formData)
  }

  const signInWithGoogle = async () => {
    return AuthService.signInWithGoogle()
  }

  const signOut = async () => {
    return AuthService.signOut()
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }
}
