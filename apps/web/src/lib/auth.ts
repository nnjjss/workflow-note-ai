const AUTH_KEY = "workflow_note_user"

export interface User {
  id: string
  name: string
  email: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function setUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function getOrCreateDemoUser(): User {
  const existing = getUser()
  if (existing) return existing
  const user: User = {
    id: crypto.randomUUID(),
    name: "사용자",
    email: "demo@workflownote.ai",
  }
  setUser(user)
  return user
}
