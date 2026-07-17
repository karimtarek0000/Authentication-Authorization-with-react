import { $checkPermissions, authService, redirectToLogin, type PermissionRequirement } from '@/auth'
import { type LoaderFunctionArgs } from 'react-router-dom'

export default function protectWithPermission(requirement: PermissionRequirement) {
  return async ({ request }: LoaderFunctionArgs) => {
    await authService.restoreSession()

    const permissions = authService?.permissions

    if (!permissions?.length || !$checkPermissions(permissions, requirement)) {
      return redirectToLogin(request)
    }

    return true
  }
}
