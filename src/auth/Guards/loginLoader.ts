import { redirectToFromParam } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router'
import { authService } from '../Service'

export default async function loginLoader({ request }: LoaderFunctionArgs) {
  await authService.restoreSession()

  if (authService.accessToken) {
    return redirectToFromParam(request)
  }

  return null
}
