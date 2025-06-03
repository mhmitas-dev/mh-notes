"use client"

import { RefreshCw, Search, Settings, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/error-message"
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
    <header className="bg-[#0c1c25] border-b border-[#1e3a47] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-[#38bdf8]">{APP_CONFIG.name}</span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user && <span className="text-[#94a3b8] text-sm">{user.email}</span>}
              {error && <ErrorMessage message={error} />}

              <button
                onClick={onRefresh}
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Search notes"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {user && (
                <Button
                  onClick={onSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e3a47]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={onToggleMobileMenu}
              className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0c1c25] border-b border-[#1e3a47] px-4 py-2">
          <div className="flex flex-col space-y-2">
            {user && <span className="text-[#94a3b8] text-sm">{user.email}</span>}
            {error && <ErrorMessage message={error} />}

            <div className="flex space-x-2">
              <button
                onClick={onRefresh}
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Search notes"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors p-2 rounded-full hover:bg-[#1e3a47]"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {user && (
              <Button
                onClick={onSignOut}
                variant="ghost"
                size="sm"
                className="justify-start text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e3a47]"
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
