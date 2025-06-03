"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { validateContextName } from "@/lib/utils/validation"
import type { Context, User } from "@/lib/types"

interface SidebarProps {
  contexts: Context[]
  activeContextId: string
  user: User | null
  saving: boolean
  onContextSelect: (contextId: string) => void
  onContextAdd: (name: string) => Promise<void>
  onContextRemove: (contextId: string) => Promise<void>
}

export function Sidebar({
  contexts,
  activeContextId,
  user,
  saving,
  onContextSelect,
  onContextAdd,
  onContextRemove,
}: SidebarProps) {
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [newContextName, setNewContextName] = useState("")

  const handleAddContext = async () => {
    if (!validateContextName(newContextName) || !user) return

    try {
      await onContextAdd(newContextName.trim())
      setNewContextName("")
      setShowNewContextInput(false)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddContext()
    } else if (e.key === "Escape") {
      setShowNewContextInput(false)
      setNewContextName("")
    }
  }

  const handleCancel = () => {
    setShowNewContextInput(false)
    setNewContextName("")
  }

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-[#112733] rounded-lg border border-[#1e3a47] shadow-md overflow-hidden">
        <div className="p-4 border-b border-[#1e3a47]">
          <h2 className="text-lg font-medium text-[#f8fafc]">Contexts</h2>
        </div>

        <div className="p-2">
          <div className="space-y-1">
            {contexts.map((context) => (
              <div key={context.id} className="relative group">
                <button
                  onClick={() => onContextSelect(context.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeContextId === context.id
                      ? "bg-[#1e3a47] text-[#38bdf8]"
                      : "text-[#cbd5e1] hover:bg-[#1e3a47] hover:text-[#f8fafc]"
                  }`}
                >
                  {context.name}
                </button>

                {contexts.length > 1 && (
                  <button
                    onClick={() => onContextRemove(context.id)}
                    disabled={saving}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#1e3a47] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add new context */}
          {showNewContextInput ? (
            <div className="mt-2 p-2">
              <Input
                value={newContextName}
                onChange={(e) => setNewContextName(e.target.value)}
                placeholder="Context name"
                className="text-sm mb-2"
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={saving}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddContext}
                  size="sm"
                  className="w-full"
                  disabled={!validateContextName(newContextName) || saving}
                >
                  {saving ? <LoadingSpinner size="sm" /> : "Add"}
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline" className="w-full" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewContextInput(true)}
              disabled={saving}
              className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-[#38bdf8] hover:bg-[#1e3a47] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Context
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
