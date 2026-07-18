import { CanView, GuardPermissions } from '@/auth'
import { Link } from 'react-router'

const Testing = GuardPermissions(() => {
  return (
    <>
      <h1 className=" text-7xl">Testing</h1>
      <Link to="/dashboard">Go to home</Link>

      <CanView permissionRequirement={{ permission: 'edit_testing' }}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit laborum nam unde
          exercitationem sequi expedita dignissimos? Fugiat quia iure natus aut nostrum recusandae
          distinctio repudiandae repellendus iste nemo voluptates, modi iusto optio reprehenderit
          deserunt mollitia officia fugit officiis odio error nulla. Ab omnis ratione distinctio
          cumque reiciendis assumenda corporis deleniti, voluptate quasi id voluptatem sit repellat
          quaerat ea laboriosam aspernatur facere. Fugiat ipsa aspernatur nam id, esse maiores
          quisquam architecto dicta sint placeat saepe minus ab tempore vel libero quas asperiores
          accusamus, quia provident ducimus minima porro excepturi eum? Libero reiciendis et modi
          sit? Qui commodi et laboriosam minima perferendis!
        </p>
      </CanView>
    </>
  )
})

export default Testing
