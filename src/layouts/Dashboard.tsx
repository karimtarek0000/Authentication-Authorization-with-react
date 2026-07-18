import { Guard } from '@/auth'
import TopProgressBar from '@/components/common/TopProgressBar'
import { Outlet, useNavigation } from 'react-router-dom'

export const Dashboard = Guard(() => {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <>
      {isNavigating && <TopProgressBar />}
      <h1 className="text-2xl text-center">Dashboard Layout</h1>
      <div className="my-5"></div>
      <Outlet />
    </>
  )
})
