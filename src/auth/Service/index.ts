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
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

let restorePromise: Promise<Login | null> | null = null
let refreshPromise: Promise<string | undefined> | null = null

const initialAuthState: AuthState = {
  user: null,
  permissions: [],
  isAuth: false,
}

export const authService = {
  accessToken: '',

  refreshSession() {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const response = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        const { accessToken } = response.data

        this.accessToken = accessToken
        return accessToken as string
      } catch {
        this.logout()
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  },
  async restoreUserInfo() {
    try {
      const { data } = await api.get(PROFILE)

      return {
        user: { name: data.name },
        permissions: data.permissions,
      }
    } catch {
      this.logout()
      return null
    }
  },
  async restoreSession(): Promise<Login | null> {
    if (this.accessToken) return null

    if (!localStorage.getItem('hasAuth')) return null

    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      try {
        await this.refreshSession()

        if (!this.accessToken) return null

        const info = await this.restoreUserInfo()

        return info
      } catch {
        return null
      } finally {
        restorePromise = null
      }
    })()

    return restorePromise
  },
  logout() {
    localStorage.removeItem('hasAuth')
    location.reload()
  },
}

export const useAuthService = () => {
  const [userAuth, setUserAuth] = useState<AuthState>({ ...initialAuthState })

  // ----- Actions -----
  const login = useCallback<AuthActions['login']>(async (email: string, password: string) => {
    try {
      const {
        data: { user, permissions, accessToken },
      } = await api.post(LOGIN, { email, password })

      setUserAuth({
        user,
        permissions,
        isAuth: true,
      })

      authService.accessToken = accessToken
      localStorage.setItem('hasAuth', 'true')
      return user
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const logout = useCallback(() => authService.logout(), [])

  // ----- UseEffects -----
  // When the app open, restore the session
  useEffect(() => {
    const restore = async () => {
      const result = await authService.restoreSession()

      if (result) {
        setUserAuth({
          user: result.user,
          permissions: result.permissions,
          isAuth: true,
        })
      }
    }

    if (localStorage.getItem('hasAuth')) {
      restore()
    }
  }, [])

  return { userAuth, login, logout }
}

// authChannel.broadcast('logout')

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
