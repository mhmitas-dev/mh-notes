import { supabase } from "@/lib/supabase"
import type { AuthFormData } from "@/lib/types"

export class AuthService {
  static async signUp({ email, password }: AuthFormData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  static async signIn({ email, password }: AuthFormData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  }

  static async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Also export as default for compatibility
export default AuthService
