import { authService } from '@/auth'
import { ensureSessionRestored, redirectToLogin } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router'

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  const info = await ensureSessionRestored()

  if (!authService.accessToken) {
    return redirectToLogin(request)
  }

  return info
}
