import { useAuthState } from '@/auth'
import type { ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router'

const GuardAuth = (Component: ComponentType<unknown>) => {
  const Wrapper = () => {
    const { isAuth } = useAuthState()
    const location = useLocation()

    const status = !isAuth
    const forRedirect = location?.state?.from || '/dashboard'

    return status ? <Component /> : <Navigate to={forRedirect} replace />
  }
  return Wrapper
}

export default GuardAuth
