import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

const NotFound = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="mx-auto mt-20 max-w-lg text-center">
        <h1 className="text-4xl font-bold">{error.status}</h1>
        <p className="mt-3 text-lg">{error.statusText || 'Something went wrong'}</p>
        {error.data && <p className="mt-2 text-sm text-muted-foreground">{String(error.data)}</p>}
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="mx-auto mt-20 max-w-lg text-center">
        <h1 className="text-4xl font-bold">500</h1>
        <p className="mt-3 text-lg">Unexpected error</p>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-20 max-w-lg text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-3 text-lg">Page not found</p>
    </div>
  )
}

export default NotFound
