"use client"

import { RefreshCw, Search, Settings, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/error-message"
import { Badge } from "@/components/ui/badge"
import { ResponsiveWrapper } from "./responsive-wrapper"
import { APP_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
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
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40 supports-[backdrop-filter]:bg-card/60">
      <ResponsiveWrapper padding="md">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
            <h1 className="text-responsive-lg font-bold text-primary truncate">{APP_CONFIG.name}</h1>
            {user && (
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs px-2 py-1 max-w-[200px] truncate">
                {user.email}
              </Badge>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {error && (
              <div className="max-w-[300px]">
                <ErrorMessage message={error} variant="destructive" className="text-xs" />
              </div>
            )}

            <Button
              onClick={onRefresh}
              variant="ghost"
              size="sm"
              className="touch-target text-muted-foreground hover:text-foreground h-8 w-8 p-0 lg:h-9 lg:w-9"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="touch-target text-muted-foreground hover:text-foreground h-8 w-8 p-0 lg:h-9 lg:w-9"
              title="Search notes"
            >
              <Search className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="touch-target text-muted-foreground hover:text-foreground h-8 w-8 p-0 lg:h-9 lg:w-9"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {user && (
              <Button
                onClick={onSignOut}
                variant="ghost"
                size="sm"
                className="touch-target text-muted-foreground hover:text-foreground px-2 lg:px-3 h-8 lg:h-9"
              >
                <LogOut className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline text-responsive-sm">Sign Out</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={onToggleMobileMenu}
              variant="ghost"
              size="sm"
              className={cn(
                "touch-target text-muted-foreground hover:text-foreground h-10 w-10 p-0",
                isMobileMenuOpen && "bg-accent text-accent-foreground",
              )}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </ResponsiveWrapper>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-in slide-in-from-top-2 duration-200">
          <ResponsiveWrapper padding="md">
            <div className="py-3 space-mobile">
              {/* User info for mobile */}
              {user && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1 max-w-full truncate">
                    {user.email}
                  </Badge>
                </div>
              )}

              {/* Error message for mobile */}
              {error && <ErrorMessage message={error} variant="destructive" className="text-xs" />}

              {/* Action buttons for mobile */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={onRefresh}
                  variant="ghost"
                  size="sm"
                  className="touch-target text-muted-foreground hover:text-foreground h-10 w-10 p-0"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="touch-target text-muted-foreground hover:text-foreground h-10 w-10 p-0"
                  title="Search notes"
                >
                  <Search className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="touch-target text-muted-foreground hover:text-foreground h-10 w-10 p-0"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Sign out button for mobile */}
              {user && (
                <Button
                  onClick={onSignOut}
                  variant="ghost"
                  size="sm"
                  className="touch-target justify-start text-muted-foreground hover:text-foreground px-2 h-10 w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-responsive-sm">Sign Out</span>
                </Button>
              )}
            </div>
          </ResponsiveWrapper>
        </div>
      )}
    </header>
  )
}
