import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { AuthedContext } from '../auth/AuthContext'
import { useAddToSaved } from '../spotify/reactQuery'
import { LIKED_ID } from './playists/Picker'
import { Button } from 'antd'
import { Track, TrackItem } from '../store'

const useIsLiked = (trackId: string, accessToken: string) => {
  const [liked, setLiked] = useState<boolean | null>(null)
  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.getQueryCache()
    const likedTracks = queryClient.getQueryData<TrackItem[]>([
      'playlistTracks',
      accessToken,
      LIKED_ID,
    ])
    if (likedTracks) setLiked(likedTracks.some((t) => t.track.id === trackId))
  }, [trackId])
  return liked
}

export const Like: React.FC<{ track: Track }> = ({ track }) => {
  const { accessToken } = useContext(AuthedContext)
  const isLiked = useIsLiked(track.id, accessToken)
  const { mutate } = useAddToSaved(accessToken)
  if (isLiked === null) return null
  return (
    <Button
      onClick={() => !isLiked && mutate({ tracks: [track] })}
      type="link"
      style={isLiked ? { color: '#ccc', cursor: 'default' } : {}}
      disabled={isLiked}
      icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
    />
  )
}
