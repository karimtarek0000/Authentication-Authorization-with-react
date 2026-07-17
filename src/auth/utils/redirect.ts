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
