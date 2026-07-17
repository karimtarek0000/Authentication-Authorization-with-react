import { useAuthState } from '@/auth/hooks/useAuth'
import type { CanProps } from '@/auth/Types'
import { checkPermissions } from '@/auth/utils/checkPermissions'

export function CanView({
  permissionRequirement,
  children,
  fallback = 'No has any permission',
}: CanProps) {
  const { permissions } = useAuthState()

  const allowed = checkPermissions(permissions, permissionRequirement)

  return <>{allowed ? children : fallback}</>
}
