import { supabase } from "@/lib/supabase"
import type { Context, Note, CreateContextData, CreateNoteData, UpdateNoteData } from "@/lib/types"
import { DEFAULT_CONTEXTS } from "@/lib/constants"

export class NotesService {
  static async getContexts(): Promise<{ data: Context[] | null; error: any }> {
    const { data, error } = await supabase.from("contexts").select("*").order("created_at", { ascending: true })
    return { data, error }
  }

  static async createContext({ name, userId }: CreateContextData): Promise<{ data: Context | null; error: any }> {
    const { data, error } = await supabase
      .from("contexts")
      .insert([{ name, user_id: userId }])
      .select()
      .single()
    return { data, error }
  }

  static async updateContext(contextId: string, name: string): Promise<{ data: Context | null; error: any }> {
    const { data, error } = await supabase
      .from("contexts")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", contextId)
      .select()
      .single()
    return { data, error }
  }

  static async deleteContext(contextId: string): Promise<{ error: any }> {
    const { error } = await supabase.from("contexts").delete().eq("id", contextId)
    return { error }
  }

  static async createDefaultContexts(userId: string): Promise<{ data: Context[] | null; error: any }> {
    const { data, error } = await supabase
      .from("contexts")
      .insert(
        DEFAULT_CONTEXTS.map((name) => ({
          name,
          user_id: userId,
        })),
      )
      .select()
    return { data, error }
  }

  static async getNotes(): Promise<{ data: Note[] | null; error: any }> {
    const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false })
    return { data, error }
  }

  static async createNote({
    contextId,
    title,
    content,
    userId,
  }: CreateNoteData): Promise<{ data: Note | null; error: any }> {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ context_id: contextId, title, content, user_id: userId }])
      .select()
      .single()
    return { data, error }
  }

  static async updateNote({ noteId, title, content }: UpdateNoteData): Promise<{ data: Note | null; error: any }> {
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", noteId)
      .select()
      .single()
    return { data, error }
  }

  static async deleteNote(noteId: string): Promise<{ error: any }> {
    const { error } = await supabase.from("notes").delete().eq("id", noteId)
    return { error }
  }
}

// Also export as default for compatibility
export default NotesService
