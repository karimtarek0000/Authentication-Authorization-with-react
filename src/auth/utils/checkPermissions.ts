import type { Permission, PermissionRequirement } from '@/auth/Types'
import { $hasAllPermissions, $hasAnyPermission, $hasPermission } from '../Permissions'

export const checkPermissions = (
  userPermissions: Permission[],
  permissionRequirement: PermissionRequirement,
): boolean => {
  if ('permission' in permissionRequirement) {
    return $hasPermission(userPermissions, permissionRequirement.permission)
  }
  if ('anyOf' in permissionRequirement) {
    return $hasAnyPermission(userPermissions, permissionRequirement.anyOf)
  }
  if ('allOf' in permissionRequirement) {
    return $hasAllPermissions(userPermissions, permissionRequirement.allOf)
  }
  return false
}
