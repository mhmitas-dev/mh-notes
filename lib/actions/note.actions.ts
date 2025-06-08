"use server"

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (move this to a separate file if reused)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getNoteById({ id }: { id: string }) {
    const { data, error } = await supabase
        .from('notes') // Replace 'notes' with your table name if different
        .select('*')
        .eq('id', id)
        .single()
    console.log(data)
    if (error) throw error
    return JSON.parse(JSON.stringify(data))
}