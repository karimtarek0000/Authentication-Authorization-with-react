import type { ReactNode } from 'react'

export type AuthEvent = 'logout'

export type CanProps = {
  permissionRequirement: PermissionRequirement
  children: ReactNode
  fallback?: ReactNode
}

type AuthUser = {
  name: string
}

export type Login = {
  accessToken: string
  user: AuthUser
  permissions: Permission[]
}

export type AuthProviderProps = {
  children: ReactNode
}

export type AuthState = {
  accessToken: string
  user: AuthUser | null
  permissions: Permission[]
  isAuth: boolean
  isLoading: boolean
}

export type AuthActions = {
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
}

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
