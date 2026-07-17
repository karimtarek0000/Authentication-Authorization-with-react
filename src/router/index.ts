import { loginLoader, protectedLoader } from '@/auth'
import { Default } from '@/layouts/Default'
import NotFound from '@/pages/Error'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Testing from '@/pages/Testing'
import type { RouterProviderProps } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    ErrorBoundary: NotFound,
    children: [
      {
        path: '/',
        Component: Default,
        loader: protectedLoader,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: 'testing',
            Component: Testing,
            // loader: requirePermission({ permission: 'edit_profile' }),
          },
        ],
      },
      {
        path: '/login',
        Component: Login,
        loader: loginLoader,
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
