import { useIdleTimeout } from '@/auth/hooks/useIdleTimeout'
import TopProgressBar from '@/components/common/TopProgressBar'
import Header from '@/components/layout/Header'
import { Outlet, useNavigation } from 'react-router-dom'

export const Default = () => {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  useIdleTimeout()

  return (
    <>
      {isNavigating && <TopProgressBar />}
      <h1 className="text-7xl">App</h1>
      <div className="my-5">
        <Header />
      </div>
      <Outlet />
    </>
  )
}
