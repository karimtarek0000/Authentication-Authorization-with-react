import type { AuthActions, AuthState } from '@/auth/Types'
import { createContext } from 'react'

export const AuthStateContext = createContext<AuthState | null>(null)
export const AuthActionsContext = createContext<AuthActions | null>(null)
