import { api, useAuthActions, useAuthState } from '@/auth'
import { Button } from '@/components/common/button'
import { useState } from 'react'
import { Link } from 'react-router'

const Home = () => {
  const [data, setData] = useState()
  const [newData, setNewData] = useState()
  const { logout } = useAuthActions()
  const { isAuth, permissions, user } = useAuthState()

  const fetchData = async () => {
    try {
      const res1 = await api.get('/data')
      const res2 = await api.get('/new-data')

      setData(res1.data)
      setNewData(res2.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>Home</h1>
      <h3>isAuth: {isAuth}</h3>
      <h3>Permissions: {permissions.join(' / ')}</h3>
      <h3>
        id: {user?.id}
        <br />
        name: {user?.name}
      </h3>
      <p>{JSON.stringify(data, null, 2)}</p>
      <p>{JSON.stringify(newData, null, 2)}</p>
      <Button onClick={fetchData}>Get the data</Button>
      <Button onClick={logout}>Logout</Button>
      {/* <Link to="/testing">Go to testing page</Link> */}
    </>
  )
}

export default Home
