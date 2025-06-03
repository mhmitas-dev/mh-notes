"use client"

import { RefreshCw, Search, Settings, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/error-message"
import { Badge } from "@/components/ui/badge"
import { APP_CONFIG } from "@/lib/constants"
import type { User } from "@/lib/types"

interface HeaderProps {
  user: User | null
  error: string | null
  onRefresh: () => void
  onSignOut: () => void
  onToggleMobileMenu: () => void
  isMobileMenuOpen: boolean
}

export function Header({ user, error, onRefresh, onSignOut, onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">{APP_CONFIG.name}</h1>
            {user && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {user.email}
              </Badge>
            )}
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {error && <ErrorMessage message={error} variant="destructive" />}

              <Button
                onClick={onRefresh}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Search notes"
              >
                <Search className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {user && (
                <Button
                  onClick={onSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              onClick={onToggleMobileMenu}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-3">
          <div className="flex flex-col space-y-3">
            {user && (
              <Badge variant="secondary" className="self-start">
                {user.email}
              </Badge>
            )}
            {error && <ErrorMessage message={error} variant="destructive" />}

            <div className="flex space-x-2">
              <Button
                onClick={onRefresh}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Search notes"
              >
                <Search className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {user && (
              <Button
                onClick={onSignOut}
                variant="ghost"
                size="sm"
                className="justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
