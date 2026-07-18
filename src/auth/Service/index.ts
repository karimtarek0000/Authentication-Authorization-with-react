import {
  api,
  authChannel,
  handleError,
  LOGIN,
  PROFILE,
  REFRESH_TOKEN,
  type AuthState,
  type Login,
} from '@/auth'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

let restorePromise: Promise<Login | null> | null = null
let refreshPromise: Promise<string | undefined> | null = null

const initialAuthState: AuthState = {
  accessToken: '',
  user: null,
  permissions: [],
  role: '',
  isAuth: false,
}

export const authService = {
  accessToken: '',
  permissions: [],
  hasAuth: localStorage.getItem('hasAuth'),

  refreshToken() {
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

    if (!this.hasAuth) return null

    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      try {
        await this.refreshToken()

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
    authChannel.broadcast('logout')
  },
}

export const useAuthService = () => {
  const [userAuth, setUserAuth] = useState<AuthState>({ ...initialAuthState })
  const [isLoading, setIsLoading] = useState(true)
  const hasAuth = useRef(localStorage.getItem('hasAuth'))

  // ----- Actions -----
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post(LOGIN, { email, password })

      const { id, name, permissions, role, accessToken } = data

      setUserAuth({
        user: { id, name },
        accessToken,
        permissions,
        role,
        isAuth: true,
      })

      localStorage.setItem('hasAuth', 'true')
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('hasAuth')
    location.reload()
    authChannel.broadcast('logout')
  }, [])

  //
  const refreshToken = useCallback(() => {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const response = await axios.post(REFRESH_TOKEN, {}, { withCredentials: true })
        const { accessToken } = response.data

        setUserAuth(prev => ({ ...prev, accessToken }))

        return accessToken
      } catch {
        logout()
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }, [logout])

  const restoreUserInfo = useCallback(
    async (accessToken: string) => {
      try {
        const { data } = await api.get(PROFILE, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const { id, name, permissions, role } = data

        setUserAuth(prev => ({
          ...prev,
          user: { id, name },
          permissions: permissions,
          role,
          isAuth: true,
        }))
      } catch {
        logout()
        return null
      }
    },
    [logout],
  )

  const restoreSession = useCallback(() => {
    if (userAuth.isAuth) return null

    if (!hasAuth.current) return null

    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      try {
        const newAccessToken = await refreshToken()

        if (!newAccessToken) return null

        await restoreUserInfo(newAccessToken)

        return null
      } finally {
        setIsLoading(false)
        restorePromise = null
      }
    })()

    return restorePromise
  }, [refreshToken, restoreUserInfo, userAuth.isAuth])

  // ----- UseEffects -----
  // Restore Session
  useEffect(() => {
    if (!hasAuth.current) {
      setIsLoading(false)
      return
    }

    restoreSession()
  }, [restoreSession])

  // Sync across tabs logout when user logout from one of them
  useEffect(() => {
    const unsubscribe = authChannel.subscribe(event => {
      if (event === 'logout') {
        location.reload()
      }
    })

    return unsubscribe
  }, [])

  return { userAuth, login, isLoading, refreshToken, logout }
}
