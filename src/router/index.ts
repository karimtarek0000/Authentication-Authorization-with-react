import { abortAllApiRequests } from '@/auth'
import { Auth, Dashboard } from '@/layouts'
import { Home, Landing, Login, Error, OAuthCallback, SignUp, Testing } from '@/pages'
import type { RouterProviderProps } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    ErrorBoundary: Error,
    children: [
      {
        path: '/',
        Component: Landing,
      },
      {
        path: '/dashboard',
        Component: Dashboard,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: 'testing',
            Component: Testing,
          },
        ],
      },
      {
        path: '/auth',
        Component: Auth,
        children: [
          {
            index: true,
            Component: Login,
          },
          {
            path: 'signup',
            Component: SignUp,
          },
          {
            path: 'callback/:provider',
            Component: OAuthCallback,
          },
        ],
      },
    ],
  },
])

// For abort requestes
let previousPathname = router.state.location.pathname

router.subscribe(state => {
  const currentPathname = state.location.pathname

  if (currentPathname !== previousPathname) {
    abortAllApiRequests()
    previousPathname = currentPathname
  }
})

export const routerProviderProps: RouterProviderProps = {
  router,
}
