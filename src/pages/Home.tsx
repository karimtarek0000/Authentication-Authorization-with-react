import { api, useAuthActions } from '@/auth'
import { Button } from '@/components/common/button'
import { useState } from 'react'
import { Link } from 'react-router'

const Home = () => {
  const [data, setData] = useState()
  const [newData, setNewData] = useState()
  const { logout } = useAuthActions()

  const fetchData = async () => {
    try {
      // const [res1, res2] = await Promise.all([api.get('/data'), api.get('/new-data')])

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
      <p>{JSON.stringify(data, null, 2)}</p>
      <p>{JSON.stringify(newData, null, 2)}</p>
      <Button onClick={fetchData}>Get the data</Button>
      <Button onClick={logout}>Logout</Button>
      {/* <Link to="/testing">Go to testing page</Link> */}
    </>
  )
}

export default Home
