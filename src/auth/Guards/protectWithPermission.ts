import { $checkPermissions, authService, type PermissionRequirement } from '@/auth'
import { redirect } from 'react-router-dom'

export default function protectWithPermission(requirement: PermissionRequirement) {
  return async () => {
    await authService.restoreSession()

    const permissions = authService?.permissions

    if (!permissions?.length || !$checkPermissions(permissions, requirement)) {
      return redirect('/dashboard')
    }

    return true
  }
}
