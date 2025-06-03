"use client"

import { supabase } from "@/lib/supabase"

export async function createDefaultContexts(userId: string) {
  const defaultContexts = ["Work", "Personal", "Ideas"]

  try {
    const { data, error } = await supabase
      .from("contexts")
      .insert(
        defaultContexts.map((name) => ({
          name,
          user_id: userId,
        })),
      )
      .select()

    if (error) throw error
    return data
  } catch (err) {
    console.error("Failed to create default contexts:", err)
    return []
  }
}
