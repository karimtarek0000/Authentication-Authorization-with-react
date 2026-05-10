import type { Permission } from '@/auth/Types'

type TokenListener = (token: string | null) => void
const HINT_KEY = 'auth_hint'
const listeners = new Set<TokenListener>()
let accessToken: string | null = null
let permissionsSession: Permission[] = []

export const tokenStore = {
  get() {
    return accessToken
  },

  getPermissions: () => permissionsSession,

  set(token: string, permissions: []) {
    accessToken = token
    if (permissions.length) permissionsSession = permissions
    localStorage.setItem(HINT_KEY, '1')
    listeners.forEach(fn => fn(token))
  },

  clear() {
    accessToken = null
    localStorage.removeItem(HINT_KEY)
    permissionsSession = []
    listeners.forEach(fn => fn(null))
    window.location.href = '/login'
  },

  hasHint: () => localStorage.getItem(HINT_KEY) === '1',

  subscribe(fn: TokenListener) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
