import { $checkPermissions, useAuthState, type CanProps } from '@/auth'

export default function CanView({
  permissionRequirement,
  children,
  fallback = 'No has any permission',
}: CanProps) {
  const { permissions } = useAuthState()

  const allowed = $checkPermissions(permissions, permissionRequirement)

  return <>{allowed ? children : fallback}</>
}
