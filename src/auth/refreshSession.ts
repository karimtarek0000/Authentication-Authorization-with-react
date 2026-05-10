import { tokenStore } from '@/auth/tokenStore'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

let refreshPromise: Promise<string | null> | null = null

export const refreshSession = (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh`, {}, { withCredentials: true })
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
}
