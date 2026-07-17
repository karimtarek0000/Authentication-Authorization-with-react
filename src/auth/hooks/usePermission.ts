import { useAuthState } from '@/auth/hooks/useAuth'
import { $hasAllPermissions, $hasAnyPermission, $hasPermission } from '@/auth/Permissions'
import type { Permission } from '@/auth/Types'

/**
 * Check if current user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { permissions } = useAuthState()
  return $hasPermission(permissions, permission)
}

/**
 * Check if current user has ANY of the given permissions
 */
export function useAnyPermission(permissions: Permission[]): boolean {
  const { permissions: userPermissions } = useAuthState()
  return $hasAnyPermission(userPermissions, permissions)
}

/**
 * Check if current user has ALL of the given permissions
 */
export function useAllPermissions(permissions: Permission[]): boolean {
  const { permissions: userPermissions } = useAuthState()
  return $hasAllPermissions(userPermissions, permissions)
}
