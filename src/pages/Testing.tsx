import { Link, useLoaderData } from 'react-router'

const Testing = () => {
  const data = useLoaderData()

  return (
    <>
      <h1 className=" text-7xl">Testing</h1>
      <h2 className=" text-5xl">Edit testing</h2>
      <p>{JSON.stringify(data, null, 2)}</p>
      <Link to="/">Go to home</Link>
    </>
  )
}

export default Testing
