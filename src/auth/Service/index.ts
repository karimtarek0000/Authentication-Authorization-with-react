import {
  api,
  handleError,
  LOGIN,
  PROFILE,
  REFRESH_TOKEN,
  type AuthActions,
  type AuthState,
  type Login,
} from '@/auth'
import { tokenStore } from '@/auth/tokenStore'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

let restorePromise: Promise<Login> | null = null
let refreshPromise: Promise<string | null> | null = null

const initialAuthState: AuthState = {
  accessToken: '',
  user: null,
  permissions: [],
  isLoading: false,
  isAuth: false,
}

export const authService = {
  refreshSession(): Promise<string | null> {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const response = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        const { accessToken } = response.data
        tokenStore.set(accessToken, [])
        return accessToken as string
      } catch {
        tokenStore.clear()
        return null
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  },
  async restoreSession(): Promise<Login> {
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      const token = await this.refreshSession()
      if (!token) return null

      try {
        const { data } = await api.get(PROFILE)

        return {
          accessToken: token,
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

export const useAuthService = () => {
  const [userAuth, setUserAuth] = useState<AuthState>({
    ...initialAuthState,
    isLoading: true,
  })

  // ----- Actions -----
  const login = useCallback<AuthActions['login']>(async (email: string, password: string) => {
    try {
      const {
        data: { user, permissions, accessToken },
      } = await api.post(LOGIN, { email, password })

      setUserAuth({
        accessToken,
        user,
        permissions,
        isLoading: false,
        isAuth: true,
      })

      localStorage.set('hasAuth', 'true')

      return user
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const logout = useCallback(() => {
    setUserAuth(initialAuthState)
    localStorage.removeItem('hasAuth')
    tokenStore.clear()
    // authChannel.broadcast('logout')
  }, [])

  // ----- UseEffects -----
  // When the app open, restore the session
  useEffect(() => {
    const restore = async () => {
      const result = await authService.restoreSession()

      if (result) {
        setUserAuth({
          accessToken: result.accessToken,
          user: result.user,
          permissions: result.permissions,
          isLoading: false,
          isAuth: true,
        })
      } else {
        setUserAuth(initialAuthState)
      }
    }

    if (localStorage.getItem('hasAuth')) {
      restore()
    }
  }, [])

  return { userAuth, login, logout }
}

// Notify when token is removed (logout, refresh failed, etc.)
// useEffect(() => {
//   const unsubscribe = tokenStore.subscribe(token => {
//     if (token === null) {
//       setUserAuth(initialAuthState)
//     }
//   })

//   return () => {
//     unsubscribe()
//   }
// }, [])

// This is subscribing to the authChannel to listen for logout events
// useEffect(() => {
//   const unsubscribe = authChannel.subscribe(event => {
//     if (event === 'logout') {
//       tokenStore.clear()
//     }
//   })

//   return unsubscribe
// }, [])
