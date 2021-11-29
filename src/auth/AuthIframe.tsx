import React, { useEffect } from 'react'
import { Scope } from '../store'
import { getLocal, spotifyAuthParams } from './AuthContext'
import { useStore } from '../store/zustand'

const AuthIframe: React.FC = () => {
  const rememberMeScope = getLocal()

  const setAuth = useStore((state) => state.setAuth)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.access_token && e?.data?.expires_in) {
        const expiresAt = Date.now() + e.data.expires_in * 1000
        setAuth({ accessToken: e.data.access_token, expiresAt, scope: [] })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setAuth])

  return rememberMeScope ? (
    <div style={{ display: 'none' }}>
      <iframe
        title="hidden-spotify"
        src={`https://accounts.spotify.com/authorize?${spotifyAuthParams(
          rememberMeScope.split(' ') as Scope[],
          '456',
          false,
        )}`}
      />
    </div>
  ) : null
}

export default AuthIframe
