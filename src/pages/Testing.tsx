import { GuardPermissions } from '@/auth'
import { Link } from 'react-router'

const Testing = GuardPermissions(() => {
  return (
    <>
      <h1 className=" text-7xl">Testing</h1>
      <Link to="/dashboard">Go to home</Link>
    </>
  )
})

export default Testing
