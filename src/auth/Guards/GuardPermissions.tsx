import { $checkPermissions, useAuthState } from '@/auth'
import type { ComponentType } from 'react'
import { Navigate } from 'react-router'

const GuardPermissions = (Component: ComponentType<unknown>) => {
  const Wrapper = () => {
    const { permissions } = useAuthState()

    const status = $checkPermissions(permissions, {
      permission: 'edit_profile',
    })

    const forRedirect = '/dashboard'

    return status ? <Component /> : <Navigate to={forRedirect} replace />
  }
  return Wrapper
}

export default GuardPermissions
