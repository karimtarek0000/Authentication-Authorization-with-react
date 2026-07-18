import { AuthProvider } from '@/auth'
import { RouterProvider } from 'react-router'
import { routerProviderProps } from './router'

function App() {
  return (
    <AuthProvider>
      <div className="container mx-auto">
        <RouterProvider {...routerProviderProps} />
      </div>
    </AuthProvider>
  )
}

export default App
