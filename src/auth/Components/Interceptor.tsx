import { api, authService, MAXIMUM_RETRY, navigationController, useAuthState } from '@/auth'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useEffect, type ReactNode } from 'react'

const Interceptor = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuthState()

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      config => {
        const requestConfig = config as InternalAxiosRequestConfig

        // Attach the current navigation signal to every request unless custom signal exists.
        if (!requestConfig.signal) {
          requestConfig.signal = navigationController.signal
        }

        if (accessToken) {
          console.log('accessToken: ', accessToken)

          requestConfig.headers.Authorization = `Bearer ${accessToken}`
        }
        return requestConfig
      },
      error => Promise.reject(error),
    )

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config

        if (!originalRequest) {
          return Promise.reject(error)
        }

        // Navigation-triggered cancellations should never be retried.
        if (error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
          return Promise.reject(error)
        }

        // Add a retry count to config if not present
        originalRequest._retryCount = originalRequest._retryCount || 0

        // Only retry at most 2 times
        if (originalRequest._retryCount < MAXIMUM_RETRY) {
          originalRequest._retryCount += 1

          // Handle 401 logic with token refresh, otherwise just retry
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
              await authService.refreshSession()
              return api(originalRequest)
            } catch (refreshError) {
              return Promise.reject(refreshError)
            }
          }

          // For ALL other errors: retry up to 2 times
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
  }, [accessToken])

  return children
}

export default Interceptor
