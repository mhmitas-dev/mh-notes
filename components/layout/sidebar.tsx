"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  Plus,
  X,
  FolderOpen,
  Edit,
  Check,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { validateContextName } from "@/lib/utils/validation"
import { cn } from "@/lib/utils"
import type { Context, User } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SidebarProps {
  contexts: Context[]
  activeContextId: string
  user: User | null
  saving: boolean
  onContextSelect: (contextId: string) => void
  onContextAdd: (name: string) => Promise<void>
  onContextRemove: (contextId: string) => Promise<void>
  onContextUpdate: (contextId: string, name: string) => Promise<void>
}

type ViewMode = "list" | "grid"

export function Sidebar({
  contexts,
  activeContextId,
  user,
  saving,
  onContextSelect,
  onContextAdd,
  onContextRemove,
  onContextUpdate,
}: SidebarProps) {
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [newContextName, setNewContextName] = useState("")
  const [editingContextId, setEditingContextId] = useState<string | null>(null)
  const [editingContextName, setEditingContextName] = useState("")
  const [contextToDelete, setContextToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isContextsCollapsed, setIsContextsCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  // Filter contexts based on search query
  const filteredContexts = useMemo(() => {
    if (!searchQuery.trim()) return contexts
    return contexts.filter((context) => context.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [contexts, searchQuery])

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

  const handleStartEditing = (context: Context) => {
    setEditingContextId(context.id)
    setEditingContextName(context.name)
  }

  const handleCancelEditing = () => {
    setEditingContextId(null)
    setEditingContextName("")
  }

  const handleSaveEditing = async () => {
    if (!editingContextId || !validateContextName(editingContextName)) return

    try {
      await onContextUpdate(editingContextId, editingContextName.trim())
      setEditingContextId(null)
      setEditingContextName("")
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleConfirmDelete = async () => {
    if (!contextToDelete) return

    try {
      await onContextRemove(contextToDelete)
      setContextToDelete(null)
    } catch (error) {
      // Error is handled by parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    } else if (e.key === "Escape") {
      e.preventDefault()
      if (editingContextId) {
        handleCancelEditing()
      } else if (showNewContextInput) {
        setShowNewContextInput(false)
        setNewContextName("")
      }
    }
  }

  const renderContextItem = (context: Context) => {
    if (editingContextId === context.id) {
      return (
        <div key={context.id} className="flex items-center gap-1 p-1">
          <Input
            value={editingContextName}
            onChange={(e) => setEditingContextName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSaveEditing)}
            className="h-7 sm:h-8 text-sm px-2"
            autoFocus
            disabled={saving}
          />
          <Button
            onClick={handleSaveEditing}
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
            disabled={!validateContextName(editingContextName) || saving}
          >
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            onClick={handleCancelEditing}
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
            disabled={saving}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )
    }

    const isActive = activeContextId === context.id

    if (viewMode === "grid") {
      return (
        <div key={context.id} className="relative group">
          <Button
            onClick={() => onContextSelect(context.id)}
            variant={isActive ? "secondary" : "outline"}
            className={cn(
              "w-full h-16 sm:h-18 p-2 text-xs sm:text-sm font-normal flex flex-col items-center justify-center gap-1",
              isActive && "bg-secondary text-secondary-foreground border-primary/50",
            )}
          >
            <FolderOpen className="w-4 h-4 flex-shrink-0" />
            <span className="truncate text-center leading-tight max-w-full">{context.name}</span>
          </Button>

          {!editingContextId && contexts.length > 1 && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartEditing(context)
                }}
                disabled={saving}
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-accent hover:text-accent-foreground"
              >
                <Edit className="w-2.5 h-2.5" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setContextToDelete(context.id)
                }}
                disabled={saving}
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </Button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div key={context.id} className="relative group">
        <Button
          onClick={() => onContextSelect(context.id)}
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-left font-normal h-8 sm:h-9 px-2 sm:px-3 text-sm",
            isActive && "bg-secondary text-secondary-foreground",
          )}
        >
          <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{context.name}</span>
        </Button>

        {!editingContextId && contexts.length > 1 && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            <Button
              onClick={() => handleStartEditing(context)}
              disabled={saving}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setContextToDelete(context.id)}
              disabled={saving}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  const hasSearchResults = searchQuery.trim() && filteredContexts.length === 0

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <Card className="shadow-sm">
        <Collapsible open={!isContextsCollapsed} onOpenChange={setIsContextsCollapsed}>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  {isContextsCollapsed ? (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contexts
                  <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                    {contexts.length}
                  </Badge>
                </CardTitle>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="px-2 sm:px-3 pb-3 sm:pb-4 space-y-3">
              {/* Search and View Controls */}
              {contexts.length > 3 && (
                <div className="space-y-2 px-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contexts..."
                      className="h-7 sm:h-8 text-sm pl-7 pr-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setViewMode("list")}
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <List className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => setViewMode("grid")}
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Grid3X3 className="w-3 h-3" />
                      </Button>
                    </div>
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery("")} variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Contexts List */}
              <div className="space-y-1">
                {hasSearchResults ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No contexts found for "{searchQuery}"
                  </div>
                ) : (
                  <ScrollArea
                    className={cn(
                      "w-full",
                      contexts.length > 6 && "h-48 sm:h-56",
                      contexts.length > 10 && "h-40 sm:h-48",
                    )}
                  >
                    <div className={cn("space-y-1 pr-2", viewMode === "grid" && "grid grid-cols-2 gap-2 space-y-0")}>
                      {filteredContexts.map(renderContextItem)}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Add new context */}
              {showNewContextInput ? (
                <div className="space-y-2 pt-2 mt-2 border-t border-border px-1">
                  <Input
                    value={newContextName}
                    onChange={(e) => setNewContextName(e.target.value)}
                    placeholder="Context name"
                    onKeyDown={(e) => handleKeyDown(e, handleAddContext)}
                    autoFocus
                    disabled={saving}
                    className="h-7 sm:h-8 text-sm px-2"
                  />
                  <div className="flex gap-1.5">
                    <Button
                      onClick={handleAddContext}
                      size="sm"
                      className="flex-1 h-7 sm:h-8 text-xs px-2"
                      disabled={!validateContextName(newContextName) || saving}
                    >
                      {saving ? <LoadingSpinner size="sm" /> : "Add"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewContextInput(false)
                        setNewContextName("")
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 sm:h-8 text-xs px-2"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNewContextInput(true)}
                  disabled={saving}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-dashed h-8 sm:h-9 text-sm px-2"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Add Context
                </Button>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={contextToDelete !== null} onOpenChange={(open) => !open && setContextToDelete(null)}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader className="space-y-2 sm:space-y-3">
            <AlertDialogTitle className="text-lg sm:text-xl">Delete Context</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this context? This action will permanently remove the context and all
              notes within it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-3">
            <AlertDialogCancel disabled={saving} className="h-8 sm:h-9 px-3 sm:px-4 text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={saving}
              className="bg-destructive hover:bg-destructive/90 h-8 sm:h-9 px-3 sm:px-4 text-sm"
            >
              {saving ? <LoadingSpinner size="sm" className="mr-1.5" /> : <Trash2 className="w-3 h-3 mr-1.5" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
