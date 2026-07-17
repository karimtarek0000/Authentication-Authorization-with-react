import { authService, checkPermissions, type PermissionRequirement } from '@/auth'
import { redirectToLogin } from '@/auth/utils/redirect'
import { redirect, type LoaderFunctionArgs } from 'react-router-dom'

export default function requirePermission(requirement: PermissionRequirement) {
  return async ({ request }: LoaderFunctionArgs) => {
    const restoreSession = await authService.restoreSession()

    const permissions = restoreSession?.permissions
    if (!permissions?.length) {
      return redirectToLogin(request)
    }

    const allowed = checkPermissions(permissions, requirement)

    if (!allowed) {
      redirect('/dashboard')
    }

    return null
  }
}
