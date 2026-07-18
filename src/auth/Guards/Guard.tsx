import { useAuthState } from '@/auth'
import type { ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router'

const Guard = (Component: ComponentType<unknown>) => {
  const Wrapper = () => {
    const { isAuth } = useAuthState()
    const location = useLocation()

    const status = isAuth
    const forRedirect = '/auth'

    return status ? (
      <Component />
    ) : (
      <Navigate to={forRedirect} state={{ from: location.pathname }} replace />
    )
  }
  return Wrapper
}

export default Guard
