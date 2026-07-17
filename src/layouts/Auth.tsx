import { Outlet } from 'react-router'

const Auth = () => {
  return (
    <>
      <h1 className="text-2xl text-center">Auth Layout</h1>
      <Outlet />
    </>
  )
}

export default Auth
