import { authService, redirectToFromParam } from '@/auth'
import { type LoaderFunctionArgs } from 'react-router'

export default async function loginLoader({ request }: LoaderFunctionArgs) {
  await authService.restoreSession()

  if (authService.accessToken) {
    return redirectToFromParam(request)
  }

  return null
}
