export const APP_CONFIG = {
  name: "Notes",
  description: "A modern note-taking application",
  version: "1.0.0",
} as const

export const ROUTES = {
  HOME: "/",
  AUTH_CALLBACK: "/auth/callback",
} as const

export const DEFAULT_CONTEXTS = ["Work", "Personal", "Ideas"] as const

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  CONTEXT_NAME_MAX_LENGTH: 50,
  NOTE_TITLE_MAX_LENGTH: 100,
  NOTE_CONTENT_MAX_LENGTH: 10000,
} as const

export const NOTE_DISPLAY = {
  COLLAPSED_HEIGHT: 120,
  PREVIEW_LINES: 4,
  LONG_NOTE_THRESHOLD: 300,
} as const
