import { $checkPermissions, useAuthState, PermissionRequirement } from '@/auth'
import type { ComponentType } from 'react'
import { Navigate } from 'react-router'

const GuardPermissions = (Component: ComponentType<unknown>, permissionsRequired: PermissionRequirement) => {
  const Wrapper = () => {
    const { permissions } = useAuthState()

    const status = $checkPermissions(permissions, permissionsRequired)

    const forRedirect = '/dashboard'

    return status ? <Component /> : <Navigate to={forRedirect} replace />
  }
  return Wrapper
}

export default GuardPermissions
