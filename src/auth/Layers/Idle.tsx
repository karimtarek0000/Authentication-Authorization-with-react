import { useIdleTimeout } from '@/auth'
import { type ReactNode } from 'react'

const Idle = ({ children }: { children: ReactNode }) => {
  useIdleTimeout()

  return children
}

export default Idle
