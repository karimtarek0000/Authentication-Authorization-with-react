import {
  AuthActionsContext,
  AuthStateContext,
  Interceptor,
  useAuthService,
  type AuthActions,
  type AuthProviderProps,
} from '@/auth'
import { useMemo } from 'react'

export function AuthProvider({ children }: AuthProviderProps) {
  const { userAuth, login, logout, isLoading } = useAuthService()

  const actions = useMemo<AuthActions>(() => ({ login, logout }), [login, logout])

  return (
    <AuthStateContext.Provider value={userAuth}>
      <AuthActionsContext.Provider value={actions}>
        {!isLoading ? <Interceptor>{children}</Interceptor> : null}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}
