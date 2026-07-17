import { tokenStore } from '@/auth/tokenStore'
import { ensureSessionRestored, redirectToLogin } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router'

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  await ensureSessionRestored()

  if (!tokenStore.get()) {
    return redirectToLogin(request)
  }

  return null
}
