import { authService } from '@/auth'
import { redirectToLogin } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router'

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  await authService.restoreSession()

  if (!authService.accessToken) {
    return redirectToLogin(request)
  }

  return true
}
