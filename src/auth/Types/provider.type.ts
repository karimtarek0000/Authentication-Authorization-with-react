import { type ReactNode } from 'react'
import type { Permission } from './permissions.type'

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
  isAuthenticated: boolean
}

export type AuthActions = {
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
}
