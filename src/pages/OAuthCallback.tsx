import { consumeOAuthState, type OAuthProvider } from '@/auth'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: OAuthProvider }>()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')

  const code = searchParams.get('code') ?? undefined
  const state = searchParams.get('state')
  const providerError = searchParams.get('error') ?? undefined

  useEffect(() => {
    const run = async () => {
      if (providerError) {
        setErrorMessage('The sign-in was cancelled or denied.')
        return
      }

      if (!provider || !code || !consumeOAuthState(provider, state)) {
        setErrorMessage('This sign-in link is invalid or has expired.')
        return
      }

      console.log('Code: ', code, 'Provider: ', provider)

      // try {
      //   await loginWithOAuth(provider, code)
      // } catch {
      //   setErrorMessage('We could not sign you in. Please try again.')
      // }
    }

    run()
  }, [provider, code, state, providerError])

  return (
    <main className="page">
      {!errorMessage ? (
        <p>Signing you in…</p>
      ) : (
        <>
          <p>{errorMessage}</p>
          <Link to="/auth/login">Back to login</Link>
        </>
      )}
    </main>
  )
}
