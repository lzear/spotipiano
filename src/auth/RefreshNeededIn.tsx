import React, { useEffect, useState } from 'react'
import { dayjs } from '../utils/dayjs'
import AuthIframe from './AuthIframe'
import { selectAuth } from '../store/selectors'
import { useStore } from '../store/zustand'

const SOON_MS = 60 * 1000 // 1 minute

const CountDown: React.FC<{ dateMs: number }> = ({ dateMs }) => {
  const [timeLeft, setTimeLeft] = useState(dayjs(dateMs).fromNow())
  useEffect(() => {
    const int = setInterval(() => setTimeLeft(dayjs(dateMs).fromNow()), 10000)
    return () => clearInterval(int)
  }, [])
  return <time dateTime={new Date(dateMs).toISOString()}>{timeLeft}</time>
}
export const RefreshNeededIn: React.FC<{ close: () => void; iframe: boolean }> =
  ({ close, iframe }) => {
    const auth = useStore(selectAuth)
    const [prevAuth] = useState(auth)

    useEffect(() => {
      if (iframe && auth !== prevAuth) close()
    }, [])

    return (
      <>
        {iframe && <AuthIframe />}
        {auth?.expiresAt && (
          <>
            Refresh session (expires{' '}
            <CountDown dateMs={auth.expiresAt - SOON_MS} />)
          </>
        )}
      </>
    )
  }
