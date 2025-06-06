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
import { ResponsiveWrapper } from "@/components/layout/responsive-wrapper"
import { validateEmail, validatePassword } from "@/lib/utils/validation"
import { APP_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
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
    <div className="min-h-screen-mobile bg-background flex items-center justify-center p-3 sm:p-4">
      <ResponsiveWrapper maxWidth="md" padding="none">
        <Card className="w-full shadow-responsive mx-auto">
          <CardHeader className="text-center pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-responsive-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
              {APP_CONFIG.name}
            </CardTitle>
            <CardDescription className="text-responsive-sm sm:text-base">
              {isSignUp ? "Create an account to start taking notes" : "Sign in to access your notes"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-mobile px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-mobile">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                disabled={loading}
                className="input-responsive"
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange("password")}
                required
                disabled={loading}
                minLength={6}
                className="input-responsive"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <Button
                type="submit"
                className={cn("w-full touch-target text-responsive-sm sm:text-base", "h-10 sm:h-11 lg:h-12")}
                disabled={!isFormValid || loading}
              >
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

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className={cn("w-full touch-target text-responsive-sm sm:text-base", "h-10 sm:h-11 lg:h-12")}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              )}
              Sign in with Google
            </Button>

            {message && <p className="text-green-600 text-responsive-sm mt-3 sm:mt-4 text-center">{message}</p>}
            {error && (
              <div className="mt-3 sm:mt-4">
                <ErrorMessage message={error} className="justify-center" />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pb-4 sm:pb-6 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary/80 text-responsive-sm underline transition-colors touch-target"
              disabled={loading || googleLoading}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </CardFooter>
        </Card>
      </ResponsiveWrapper>
    </div>
  )
}
