import { api } from '@/auth/APIclient'
import { authChannel } from '@/auth/authChannel'
import { refreshSession } from '@/auth/refreshSession'
import { tokenStore } from '@/auth/tokenStore'
import type { Login } from '@/auth/Types'
import { AxiosError } from 'axios'

let restorePromise: Promise<Login> | null = null

export const authService = {
  async login(email: string, password: string): Promise<Login> {
    try {
      const { data } = await api.post('/auth-test', { email, password })

      tokenStore.set(data.accessToken, data.permissions)

      return {
        user: { name: data.name },
        permissions: data.permissions,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          return Promise.reject(new Error('Too many attempts, please try again later'))
        }
        if (error.response?.status === 423) {
          return Promise.reject(new Error('Account is locked, please contact support'))
        }
        if (error.response?.status === 401) {
          return Promise.reject(new Error('Email or password is incorrect'))
        }
      }

      return Promise.reject(new Error('An error occurred, please try again'))
    }
  },

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
