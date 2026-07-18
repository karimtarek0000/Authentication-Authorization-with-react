import {
  AuthActionsContext,
  AuthStateContext,
  Idle,
  Interceptor,
  SyncTabs,
  useAuthService,
  type AuthActions,
  type AuthProviderProps,
} from '@/auth'
import { useMemo } from 'react'

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, userAuth, login, logout, refreshToken, loginWithOAuth } = useAuthService()

  const actions = useMemo<AuthActions>(
    () => ({ login, logout, refreshToken, loginWithOAuth }),
    [login, logout, refreshToken, loginWithOAuth],
  )

  if (isLoading) return null

  return (
    <AuthStateContext.Provider value={userAuth}>
      <AuthActionsContext.Provider value={actions}>
        <Interceptor>
          <SyncTabs>
            <Idle>{children}</Idle>
          </SyncTabs>
        </Interceptor>
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}
