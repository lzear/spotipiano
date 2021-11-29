import React from 'react'
import { PlayingContext } from '../spotify/SpotifyContext'
import { selectAuth } from '../store/selectors'
import { AuthedContext } from './AuthContext'
import { MyLayout } from '../layout'
import { AutoLogin } from './AutoLogin'
import { AuthRefresher } from './AuthRefresher'
import { AutoDevicr } from '../devices/AutoDevicr'
import { useStore } from '../store/zustand'
import { WidthSetter } from '../layout/useWidth'

const AuthProvider: React.FC<{ sounds: string[] }> = ({ children, sounds }) => {
  const auth = useStore(selectAuth)

  if (!auth) return <AutoLogin sounds={sounds} />

  return (
    <AuthedContext.Provider value={{ accessToken: auth.accessToken }}>
      <AuthRefresher />
      <AutoDevicr />
      <WidthSetter />
      <PlayingContext>
        <MyLayout>{children}</MyLayout>
      </PlayingContext>
    </AuthedContext.Provider>
  )
}

export default AuthProvider
