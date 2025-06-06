"use client"

import { useState, useMemo } from "react"
import { FolderOpen, Search, ChevronDown, ChevronRight, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { Context, User } from "@/lib/types"

interface SidebarProps {
  contexts: Context[]
  activeContextId: string
  user: User | null
  saving: boolean
  onContextSelect: (contextId: string) => void
  onAddContextClick: () => void
  onManageContextsClick: () => void
}

export function Sidebar({
  contexts,
  activeContextId,
  user,
  saving,
  onContextSelect,
  onAddContextClick,
  onManageContextsClick,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isContextsCollapsed, setIsContextsCollapsed] = useState(false)

  // Filter contexts based on search query
  const filteredContexts = useMemo(() => {
    if (!searchQuery.trim()) return contexts
    return contexts.filter((context) => context.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [contexts, searchQuery])

  const renderContextItem = (context: Context) => {
    const isActive = activeContextId === context.id

    return (
      <Button
        key={context.id}
        onClick={() => onContextSelect(context.id)}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start text-left font-normal touch-target",
          "h-9 sm:h-10 px-3 text-responsive-sm",
          "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
          isActive && "bg-secondary/80 text-secondary-foreground shadow-sm",
        )}
      >
        <FolderOpen className="w-4 h-4 mr-3 flex-shrink-0" />
        <span className="truncate">{context.name}</span>
      </Button>
    )
  }

  const hasSearchResults = searchQuery.trim() && filteredContexts.length === 0

  return (
    <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="card-responsive shadow-responsive overflow-hidden">
        <Collapsible open={!isContextsCollapsed} onOpenChange={setIsContextsCollapsed}>
          {/* Header */}
          <div className="px-3 sm:px-4 py-3 bg-muted/30">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent touch-target">
                <div className="flex items-center gap-2 min-w-0">
                  {isContextsCollapsed ? (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left min-w-0">
                    <h2 className="text-responsive-base font-semibold text-foreground truncate">Contexts</h2>
                    <p className="text-xs text-muted-foreground truncate">Organize your notes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1 flex-shrink-0">
                  {contexts.length}
                </Badge>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="px-3 sm:px-4 py-4 space-mobile">
              {/* Search and Manage Controls */}
              <div className="space-mobile">
                {contexts.length > 3 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contexts..."
                      className="input-responsive pl-9 pr-3 border-border/60 focus:border-primary/60"
                    />
                  </div>
                )}

                {/* Context Management Buttons - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={onAddContextClick}
                    variant="outline"
                    size="sm"
                    className="flex-1 touch-target h-9 sm:h-10 text-responsive-sm border-border/60 hover:border-border"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="truncate">Add Context</span>
                  </Button>
                  <Button
                    onClick={onManageContextsClick}
                    variant="outline"
                    size="sm"
                    className="flex-1 touch-target h-9 sm:h-10 text-responsive-sm border-border/60 hover:border-border"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="truncate">Manage</span>
                  </Button>
                </div>

                {searchQuery && (
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs touch-target"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Contexts List */}
              <div className="space-y-1">
                {hasSearchResults ? (
                  <div className="text-center py-6 text-responsive-sm text-muted-foreground">
                    <p>No contexts found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <ScrollArea
                    className={cn(
                      "w-full custom-scrollbar",
                      contexts.length > 6 && "h-48 sm:h-56 lg:h-64",
                      contexts.length > 10 && "h-40 sm:h-48 lg:h-56",
                    )}
                  >
                    <div className="space-y-1 pr-2">{filteredContexts.map(renderContextItem)}</div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
