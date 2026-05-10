import { authChannel, authService, tokenStore } from '@/auth'
import type { AuthActions, AuthProviderProps, AuthState } from '@/auth/Types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthActionsContext, AuthStateContext } from './config'

const initialAuthState: AuthState = {
  user: null,
  permissions: [],
  isLoading: false,
  isAuthenticated: false,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    ...initialAuthState,
    isLoading: true,
  })

  // ----- Actions -----
  const login = useCallback<AuthActions['login']>(async (email, password) => {
    const result = await authService.login(email, password)
    setState({
      user: result.user,
      permissions: result.permissions,
      isLoading: false,
      isAuthenticated: true,
    })
    return result.user
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  const actions = useMemo<AuthActions>(() => ({ login, logout }), [login, logout])

  // ----- UseEffects -----
  // When a user opens the app, try to restore the session
  useEffect(() => {
    const restore = async () => {
      const result = await authService.restoreSession()

      if (result) {
        setState({
          user: result.user,
          permissions: result.permissions,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState(initialAuthState)
      }
    }

    if (tokenStore.hasHint()) {
      restore()
    }
  }, [])

  // Notify when token is removed (logout, refresh failed, etc.)
  useEffect(() => {
    const unsubscribe = tokenStore.subscribe(token => {
      if (token === null) {
        setState(initialAuthState)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // This is subscribing to the authChannel to listen for logout events
  useEffect(() => {
    const unsubscribe = authChannel.subscribe(event => {
      if (event === 'logout') {
        tokenStore.clear()
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}
