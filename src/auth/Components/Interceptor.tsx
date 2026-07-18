import { api, MAXIMUM_RETRY, navigationController, useAuthActions, useAuthState } from '@/auth'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useEffect, useRef, type ReactNode } from 'react'

const Interceptor = ({ children }: { children: ReactNode }) => {
  const { refreshToken } = useAuthActions()
  const { accessToken } = useAuthState()
  const tokenRef = useRef(accessToken)

  useEffect(() => {
    tokenRef.current = accessToken
  }, [accessToken])

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      config => {
        const requestConfig = config as InternalAxiosRequestConfig

        // Attach the current navigation signal to every request unless a custom signal exists.
        if (!requestConfig.signal) {
          requestConfig.signal = navigationController.signal
        }

        if (!requestConfig.headers.Authorization && tokenRef.current) {
          requestConfig.headers.Authorization = `Bearer ${tokenRef.current}`
        }

        return requestConfig
      },
      error => Promise.reject(error),
    )

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config

        // Navigation-triggered cancellations should never be retried.
        if (!originalRequest || error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
          return Promise.reject(error)
        }

        // Add a retry count to config if not present
        originalRequest._retryCount = originalRequest._retryCount || 0

        // Only retry at most MAXIMUM_RETRY times
        if (originalRequest._retryCount < MAXIMUM_RETRY) {
          originalRequest._retryCount += 1

          // Handle 401 logic with token refresh, otherwise just retry
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
              const newAccessToken = await refreshToken()
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

              return api(originalRequest)
            } catch (refreshError) {
              return Promise.reject(refreshError)
            }
          }

          // For ALL other errors: retry up to MAXIMUM_RETRY times
          try {
            return api(originalRequest)
          } catch (retryError) {
            return Promise.reject(retryError)
          }
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [refreshToken])

  return children
}

export default Interceptor
