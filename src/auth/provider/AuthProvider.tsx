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
  const { isLoading, userAuth, login, logout, refreshToken } = useAuthService()

  const actions = useMemo<AuthActions>(
    () => ({ login, logout, refreshToken }),
    [login, logout, refreshToken],
  )

  if (isLoading) return null

  return (
    <AuthStateContext.Provider value={userAuth}>
      <AuthActionsContext.Provider value={actions}>
        <Interceptor>{children}</Interceptor>
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}
