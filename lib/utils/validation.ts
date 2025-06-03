import { VALIDATION } from "@/lib/constants"

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH
}

export const validateContextName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= VALIDATION.CONTEXT_NAME_MAX_LENGTH
}

export const validateNoteContent = (content: string): boolean => {
  return content.trim().length > 0 && content.length <= VALIDATION.NOTE_CONTENT_MAX_LENGTH
}

export const formatValidationError = (field: string, message: string): string => {
  return `${field}: ${message}`
}
