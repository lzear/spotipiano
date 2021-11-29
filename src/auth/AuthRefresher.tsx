import { selectAuth, selectSetAuth } from '../store/selectors'
import { Auth } from './AuthContext'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useStore } from '../store/zustand'

const AuthIframe = dynamic(() => import('./AuthIframe'), {
  ssr: false,
})

const willExpireIn = (auth: Auth, ms: number) =>
  Date.now() + ms > auth.expiresAt

const ONE_MINUTE = 60 * 1000 // 1 minute

export const AuthRefresher: React.FC = () => {
  const setAuth = useStore(selectSetAuth)
  const auth = useStore(selectAuth)
  const [expiresSoon, setExpiresSoon] = useState(
    auth && willExpireIn(auth, ONE_MINUTE),
  )

  useEffect(() => {
    const expiresAt = auth?.expiresAt
    if (expiresAt) {
      if (expiresSoon) setAuth(null)
      else {
        const timeout = setTimeout(
          () => setExpiresSoon(true),
          expiresAt - (Date.now() + ONE_MINUTE),
        )
        return () => clearTimeout(timeout)
      }
    }
  }, [auth, setAuth])

  return expiresSoon ? <AuthIframe /> : null
}
