import type { ReactNode } from 'react'

export * from './provider.type'

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
  user: AuthUser
  permissions: Permission[]
}

export type AuthProviderProps = {
  children: ReactNode
}

export type AuthState = {
  user: AuthUser | null
  permissions: Permission[]
  isLoading: boolean
  isAuth: boolean
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
