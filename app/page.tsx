"use client"

import NotesApp from "../notes-app"
import { AuthForm } from "../components/auth-form"
import { useAuth } from "../hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001e2b] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#38bdf8]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  return user ? <NotesApp /> : <AuthForm />
}
