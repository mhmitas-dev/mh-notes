import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Context = {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  context_id: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
}
