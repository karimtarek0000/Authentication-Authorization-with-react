import { useAuthActions, useAuthState } from '@/auth/hooks/useAuth'
import { Link, useNavigate } from 'react-router'

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuthState()
  const navigate = useNavigate()
  const { logout } = useAuthActions()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          <p className="mb-3">{isAuthenticated && <span>أهلاً، {user.name}</span>}</p>
          {isAuthenticated ? (
            <button onClick={handleLogout}>خروج</button>
          ) : (
            <Link to={'/login'}>Login</Link>
          )}
        </div>
      )}
    </header>
  )
}
