import type { ReactNode } from 'react'

// ================= USER =================
type AuthUser = {
  id: string
  name: string
}

export type Login = {
  user: AuthUser
  permissions: Permission[]
  role: string
}

// ================= CONTEXT_API =================
export type AuthProviderProps = {
  children: ReactNode
}

export type AuthState = {
  accessToken: string
  user: AuthUser | null
  permissions: Permission[]
  role: string
  isAuth: boolean
}

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>
  refreshToken: () => Promise<string | undefined>
  logout: () => void
}

// ================= SYNC =================
export type AuthEvent = 'logout'

// ================= PERMISSIONS =================
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  EDIT_PROFILE: 'edit_profile',
  MANAGE_USERS: 'manage_users',
  EDIT_TESTING: 'edit_testing',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export type PermissionRequirement =
  | { permission: Permission }
  | { anyOf: Permission[] }
  | { allOf: Permission[] }
