"use client"
import { useState, useMemo } from "react"
import { FolderOpen, ChevronDown, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { Context } from "@/lib/types"

interface CompactSidebarProps {
  contexts: Context[]
  activeContextId: string
  onContextSelect: (contextId: string) => void
  onAddContext: () => void
  className?: string
}

export function CompactSidebar({
  contexts,
  activeContextId,
  onContextSelect,
  onAddContext,
  className,
}: CompactSidebarProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const activeContext = contexts.find((c) => c.id === activeContextId)

  const filteredContexts = useMemo(() => {
    if (!searchQuery.trim()) return contexts
    return contexts.filter((context) => context.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [contexts, searchQuery])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-10 px-3">
            <div className="flex items-center gap-2 min-w-0">
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm">{activeContext ? activeContext.name : "Select context..."}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {contexts.length}
              </Badge>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm p-0 mx-4" align="start" side="bottom" sideOffset={8}>
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search contexts..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <CommandEmpty>No contexts found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-48 max-h-[50vh]">
                  {filteredContexts.map((context) => (
                    <CommandItem
                      key={context.id}
                      value={context.id}
                      onSelect={() => {
                        onContextSelect(context.id)
                        setOpen(false)
                      }}
                      className="flex items-center gap-2 px-3 py-3 cursor-pointer"
                    >
                      <FolderOpen className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate flex-1">{context.name}</span>
                      {context.id === activeContextId && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          Active
                        </Badge>
                      )}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
              <div className="border-t p-2">
                <Button
                  onClick={() => {
                    onAddContext()
                    setOpen(false)
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new context
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
