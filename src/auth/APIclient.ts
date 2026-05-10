import { refreshSession } from '@/auth/refreshSession'
import { tokenStore } from '@/auth/tokenStore'
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10_000,
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = tokenStore.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Add a retry count to config if not present
    originalRequest._retryCount = originalRequest._retryCount || 0

    // Only retry at most 2 times
    if (originalRequest._retryCount < 2) {
      originalRequest._retryCount += 1

      // Handle 401 logic with token refresh, otherwise just retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const newToken = await refreshSession()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
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
