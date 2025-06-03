"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus } from "lucide-react"
import { validateContextName } from "@/lib/utils/validation"

interface ContextAddDialogProps {
  onAddContext: (name: string) => Promise<void>
  saving: boolean
  trigger?: React.ReactNode
}

export function ContextAddDialog({ onAddContext, saving, trigger }: ContextAddDialogProps) {
  const [open, setOpen] = useState(false)
  const [contextName, setContextName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateContextName(contextName)) return

    try {
      await onAddContext(contextName.trim())
      setContextName("")
      setOpen(false)
    } catch (error) {
      // Error handled by parent
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Context
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Context</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Context name"
            value={contextName}
            onChange={(e) => setContextName(e.target.value)}
            disabled={saving}
            autoFocus
            maxLength={50}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!validateContextName(contextName) || saving} className="flex-1">
              {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
