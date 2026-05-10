import { tokenStore } from '@/auth/tokenStore'
import type { PermissionRequirement } from '@/auth/Types'
import { checkPermissions } from '@/auth/utils/checkPermissions'
import { redirectToLogin } from '@/auth/utils/redirect'
import { type LoaderFunctionArgs } from 'react-router-dom'

export function requirePermission(requirement: PermissionRequirement) {
  return async ({ request }: LoaderFunctionArgs) => {
    const permissions = tokenStore.getPermissions()

    if (!permissions.length) {
      return redirectToLogin(request)
    }

    const allowed = checkPermissions(permissions, requirement)

    if (!allowed) {
      throw new Response('You do not have permission to access this page.', {
        status: 403,
        statusText: 'Forbidden',
      })
    }

    return null
  }
}
