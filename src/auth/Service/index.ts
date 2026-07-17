import {
  api,
  authChannel,
  handleError,
  LOGIN,
  type AuthActions,
  type AuthState,
  type Login,
} from '@/auth'
import { refreshSession } from '@/auth/refreshSession'
import { tokenStore } from '@/auth/tokenStore'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

let restorePromise: Promise<Login> | null = null

export const authService = {
  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch (error) {
      if (error instanceof AxiosError) {
        console.warn('Logout API failed, clearing local state anyway')
      }
    } finally {
      tokenStore.clear()
      authChannel.broadcast('logout')
    }
  },

  async restoreSession(): Promise<Login> {
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      const token = await refreshSession()
      if (!token) return null

      try {
        const { data } = await api.get('/me')

        tokenStore.set(token, data.permissions)
        return {
          user: { name: data.name, email: data.email },
          permissions: data.permissions,
        }
      } catch {
        tokenStore.clear()
        return null
      }
    })()

    try {
      return await restorePromise
    } finally {
      restorePromise = null
    }
  },
}

//
const initialAuthState: AuthState = {
  user: null,
  permissions: [],
  isLoading: false,
  isAuth: false,
}
export const useAuthService = () => {
  const [state, setState] = useState<AuthState>({
    ...initialAuthState,
    isLoading: true,
  })

  // ----- Actions -----
  const login = useCallback<AuthActions['login']>(async (email: string, password: string) => {
    try {
      const {
        data: { user, permissions, accessToken },
      } = await api.post(LOGIN, { email, password })

      tokenStore.set(accessToken, permissions)

      setState({
        user,
        permissions,
        isLoading: false,
        isAuth: true,
      })

      return user
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

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
          isAuth: true,
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

  return { state, login, logout }
}
