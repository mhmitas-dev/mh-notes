export interface User {
  id: string
  email: string
  created_at: string
}

export interface Context {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  context_id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

export interface NotesState {
  contexts: Context[]
  notes: Note[]
  loading: boolean
  error: string | null
}

export interface AuthFormData {
  email: string
  password: string
}

export interface CreateContextData {
  name: string
  userId: string
}

export interface CreateNoteData {
  contextId: string
  title: string
  content: string
  userId: string
}

export interface UpdateNoteData {
  noteId: string
  title: string
  content: string
}
