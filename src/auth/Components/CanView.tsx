import { $checkPermissions, useAuthState, type CanProps } from '@/auth'

export default function CanView({
  permissionRequirement,
  children,
  fallback = 'You not authorized to view this section',
}: CanProps) {
  const { permissions } = useAuthState()

  const allowed = $checkPermissions(permissions, permissionRequirement)

  if (!allowed) {
    return <h3>{fallback}</h3>
  }

  return children
}
