import {
  api,
  authChannel,
  getOAuthRedirectURL,
  handleError,
  LOGIN,
  OAUTH_PLATFORM,
  PROFILE,
  REFRESH_TOKEN,
  type AuthState,
  type Login,
  type OAuthProvider,
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

export const useAuthService = () => {
  const [userAuth, setUserAuth] = useState<AuthState>(initialAuthState)
  const [isLoading, setIsLoading] = useState(true)
  const hasAuth = useRef(localStorage.getItem('hasAuth'))

  const setAuthData = (data: any) => {
    const { id, name, permissions, role, accessToken } = data

    setUserAuth({
      user: { id, name },
      accessToken,
      permissions,
      role,
      isAuth: true,
    })

    localStorage.setItem('hasAuth', 'true')
  }

  // =================== Handlers ===================
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post(LOGIN, { email, password })
      setAuthData(data)
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }, [])

  const loginWithOAuth = async (provider: OAuthProvider, code: string) => {
    try {
      const endpoint = OAUTH_PLATFORM[provider]

      const { data } = await api.post(endpoint, {
        code,
        redirectURL: getOAuthRedirectURL(provider),
      })

      setAuthData(data)
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('hasAuth')
    location.reload()
    authChannel.broadcast('logout')
  }, [])

  // =================== Restore Session Functions ===================
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

  // =================== Restore Session Invoic ===================
  useEffect(() => {
    if (!hasAuth.current) {
      setIsLoading(false)
      return
    }

    restoreSession()
  }, [restoreSession])

  return { userAuth, login, loginWithOAuth, isLoading, refreshToken, logout }
}
