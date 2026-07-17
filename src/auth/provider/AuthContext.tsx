import {
  AuthActionsContext,
  AuthStateContext,
  useAuthService,
  type AuthActions,
  type AuthProviderProps,
} from '@/auth'
import { useMemo } from 'react'

export function AuthProvider({ children }: AuthProviderProps) {
  const { userAuth, login, logout } = useAuthService()

  const actions = useMemo<AuthActions>(() => ({ login, logout }), [login, logout])

  return (
    <AuthStateContext.Provider value={userAuth}>
      <AuthActionsContext.Provider value={actions}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}
