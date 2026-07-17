import { tokenStore } from '@/auth/tokenStore'
import { ensureSessionRestored, redirectToFromParam } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router'

export default async function loginLoader({ request }: LoaderFunctionArgs) {
  await ensureSessionRestored()

  if (tokenStore.get()) {
    return redirectToFromParam(request)
  }

  return null
}
