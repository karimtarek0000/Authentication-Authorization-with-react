import { protectedLoader, protectedLoginLoader, protectWithPermission } from '@/auth'
import Auth from '@/layouts/Auth'
import { Dashboard } from '@/layouts/Dashboard'
import { Home, Landing, Login, NotFound, SignUp, Testing } from '@/pages'
import type { RouterProviderProps } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    ErrorBoundary: NotFound,
    children: [
      {
        path: '/',
        Component: Landing,
      },
      {
        path: '/dashboard',
        Component: Dashboard,
        loader: protectedLoader,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: 'testing',
            Component: Testing,
            loader: protectWithPermission({ permission: 'edit_testing' }),
          },
        ],
      },
      {
        path: '/auth',
        Component: Auth,
        loader: protectedLoginLoader,
        children: [
          {
            index: true,
            Component: Login,
          },
          {
            path: 'signup',
            Component: SignUp,
          },
        ],
      },
    ],
  },
])

// For abort requestes
// let previousPathname = router.state.location.pathname

// router.subscribe(state => {
//   const currentPathname = state.location.pathname

//   if (currentPathname !== previousPathname) {
//     abortAllApiRequests()
//     previousPathname = currentPathname
//   }
// })

export const routerProviderProps: RouterProviderProps = {
  router,
}
