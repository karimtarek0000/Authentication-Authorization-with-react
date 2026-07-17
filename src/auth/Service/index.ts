import { api, handleError, LOGIN, PROFILE, REFRESH_TOKEN, type AuthState, type Login } from '@/auth'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

let restorePromise: Promise<Login | null> | null = null
let refreshPromise: Promise<string | undefined> | null = null

const initialAuthState: AuthState = {
  user: null,
  permissions: [],
  role: '',
  isAuth: false,
}

export const authService = {
  accessToken: '',
  permissions: [],

  refreshSession() {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const response = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        const { accessToken } = response.data

        this.accessToken = accessToken
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
      const { id, name, permissions, role } = data

      this.permissions = permissions

      return {
        user: { id, name },
        permissions: permissions,
        role,
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
  getHasAuth() {
    try {
      return JSON.stringify(localStorage.getItem('hasAuth'))
    } catch {
      return null
    }
  },
  logout() {
    localStorage.removeItem('hasAuth')
    location.reload()
    // authChannel.broadcast('logout')
  },
}

export const useAuthService = () => {
  const [userAuth, setUserAuth] = useState<AuthState>({ ...initialAuthState })

  // ----- Actions -----
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post(LOGIN, { email, password })

      const { id, name, permissions, role, accessToken } = data

      setUserAuth({
        user: { id, name },
        permissions,
        role,
        isAuth: true,
      })

      Object.assign(authService, { accessToken, permissions })
      localStorage.setItem('hasAuth', 'true')
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const logout = useCallback(() => authService.logout(), [])

  // ----- UseEffects -----
  // Restore Session
  useEffect(() => {
    const restore = async () => {
      const result = await authService.restoreSession()

      if (result) {
        const { user, permissions, role } = result
        setUserAuth({
          user,
          permissions,
          role,
          isAuth: true,
        })
      }
    }

    if (authService.getHasAuth()) {
      restore()
    }
  }, [])

  // This is subscribing to the authChannel to listen for logout events
  // useEffect(() => {
  //   const unsubscribe = authChannel.subscribe(event => {
  //     if (event === 'logout') {
  //       tokenStore.clear()
  //     }
  //   })

  //   return unsubscribe
  // }, [])

  return { userAuth, login, logout }
}
