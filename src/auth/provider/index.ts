import { createContext } from 'react'
import type { AuthActions, AuthState } from '../Types'
import AuthContext from './AuthContext'
import { useAuthActions, useAuthState } from './useAuthContext'

const AuthStateContext = createContext<AuthState | null>(null)
const AuthActionsContext = createContext<AuthActions | null>(null)

export { AuthActionsContext, AuthContext, AuthStateContext, useAuthActions, useAuthState }
