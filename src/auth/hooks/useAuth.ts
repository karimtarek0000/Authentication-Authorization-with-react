import { AuthActionsContext, AuthStateContext } from '@/auth/Provider/config'
import { useContext } from 'react'

export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (context === null) {
    throw new Error('useAuthState must be used within AuthProvider')
  }
  return context
}

export function useAuthActions() {
  const context = useContext(AuthActionsContext)
  if (context === null) {
    throw new Error('useAuthActions must be used within AuthProvider')
  }
  return context
}
