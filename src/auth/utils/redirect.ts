import { authService } from '@/auth/authService'
import { tokenStore } from '@/auth/tokenStore'
import { redirect } from 'react-router'

export function redirectToFromParam(request: Request) {
  const url = new URL(request.url)
  const from = url.searchParams.get('from') || '/'
  return redirect(from)
}

export function redirectToLogin(request: Request) {
  const url = new URL(request.url)
  const params = new URLSearchParams({ from: url.pathname })
  return redirect(`/login?${params.toString()}`)
}

export const ensureSessionRestored = async () => {
  if (tokenStore.get()) return

  if (!tokenStore.hasAuth()) return

  return await authService.restoreSession()
}
