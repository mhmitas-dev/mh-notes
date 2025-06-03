"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { GoogleIcon } from "./google-icon"
import { validateEmail, validatePassword } from "@/lib/utils/validation"
import { APP_CONFIG } from "@/lib/constants"
import type { AuthFormData } from "@/lib/types"

interface AuthFormProps {
  onSignUp: (data: AuthFormData) => Promise<{ error: any }>
  onSignIn: (data: AuthFormData) => Promise<{ error: any }>
  onGoogleSignIn: () => Promise<{ error: any }>
}

export function AuthForm({ onSignUp, onSignIn, onGoogleSignIn }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState<AuthFormData>({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      setError("Please enter a valid email and password (min 6 characters)")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { error } = isSignUp ? await onSignUp(formData) : await onSignIn(formData)

      if (error) throw error

      if (isSignUp) {
        setMessage("Check your email for the confirmation link!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      const { error } = await onGoogleSignIn()
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
      setGoogleLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuthFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isFormValid = validateEmail(formData.email) && validatePassword(formData.password)

  return (
    <div className="min-h-screen bg-[#001e2b] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#1e3a47] bg-[#112733] shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-[#38bdf8] mb-2">{APP_CONFIG.name}</CardTitle>
          <CardDescription className="text-[#94a3b8]">
            {isSignUp ? "Create an account to start taking notes" : "Sign in to access your notes"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              disabled={loading}
              className="bg-[#0c1c25]"
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange("password")}
              required
              disabled={loading}
              minLength={6}
              className="bg-[#0c1c25]"
            />
            <Button type="submit" className="w-full" disabled={!isFormValid || loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>{isSignUp ? "Sign Up" : "Sign In"}</>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-[#1e3a47]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#112733] px-2 text-[#64748b]">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full border-[#1e3a47]"
            disabled={googleLoading}
          >
            {googleLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <GoogleIcon className="w-5 h-5 mr-2" />}
            Sign in with Google
          </Button>

          {message && <p className="text-[#10b981] text-sm mt-4 text-center">{message}</p>}
          {error && <ErrorMessage message={error} className="mt-4 justify-center" />}
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#38bdf8] hover:text-[#0ea5e9] text-sm underline"
            disabled={loading || googleLoading}
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
