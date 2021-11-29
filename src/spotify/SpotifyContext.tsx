import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { getCurrentlyPlaying } from './reactQuery'
import { selectAuth, selectSetPlayState } from '../store/selectors'
import { useStore } from '../store/zustand'

const useCurrent = (accessToken?: string) => {
  const setPlayState = useStore(selectSetPlayState)
  const cur = useQuery(
    ['currently-playing', accessToken || ''],
    getCurrentlyPlaying,
    {
      enabled: !!accessToken,
    },
  )
  const data = cur.data

  useEffect(() => {
    if (!cur.isFetching)
      if (data === null) setPlayState(null)
      else if (data?.item)
        setPlayState({
          track: data.item,
          positionMs: data.progress_ms,
          playedAt: data.is_playing ? Date.now() : null,
        })
  }, [cur, data, setPlayState])
  return cur
}

export const PlayingContext: React.FC = ({ children }) => {
  const auth = useStore(selectAuth)
  useCurrent(auth?.accessToken)

  return <>{children}</>
}
