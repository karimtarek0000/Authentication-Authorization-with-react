import TopProgressBar from '@/components/common/TopProgressBar'
import { Outlet, useNavigation } from 'react-router-dom'

export const Default = () => {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <>
      {isNavigating && <TopProgressBar />}
      <h1 className="text-7xl">App</h1>
      <div className="my-5"></div>
      <Outlet />
    </>
  )
}
