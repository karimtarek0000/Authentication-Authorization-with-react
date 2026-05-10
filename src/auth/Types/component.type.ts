import type { ReactNode } from 'react'
import type { PermissionRequirement } from './permissions.type'

export type CanProps = {
  permissionRequirement: PermissionRequirement
  children: ReactNode
  fallback?: ReactNode
}
