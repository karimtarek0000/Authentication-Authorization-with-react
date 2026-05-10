import { abortAllApiRequests } from '@/auth/APIclient'
import { loginLoader } from '@/auth/loaders/loginLoader'
import { protectedLoader } from '@/auth/loaders/protectedLoader'
import { requirePermission } from '@/auth/loaders/protectWithPermission'
import { Default } from '@/layouts/Default'
import Finincial from '@/pages/Finincial'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Testing from '@/pages/Testing'

import type { RouterProviderProps } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
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
        loader: requirePermission({ permission: 'edit_profile' }),
      },
      {
        path: 'finincial',
        Component: Finincial,
      },
    ],
  },
  {
    path: '/login',
    Component: Login,
    loader: loginLoader,
  },
  {
    path: '/403',
    Component: NotFound,
  },
])

// For abort requetes
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
