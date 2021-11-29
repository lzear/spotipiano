import { Progress } from 'antd'
import React from 'react'
import { Store, useStore } from '../../store/zustand'
import { usePickedPlaylistTracks } from '../TracksContext'
import { TracksWithSearch } from '../withSearch'
const selectPlaylistsLoading = (s: Store) => s.playlistsLoading
export const PlaylistsTracks: React.FC = () => {
  const { tracks, loading } = usePickedPlaylistTracks()

  const playlistsLoading = useStore(selectPlaylistsLoading)

  const s = Object.values(playlistsLoading).reduce(
    (acc: { offset: number; total: number }, cur) => {
      return {
        offset: acc.offset + cur.offset,
        total: acc.total + (cur.total ?? 50),
      }
    },
    { offset: 0, total: 0 },
  )

  return (
    <>
      {s.total && (
        <Progress
          percent={(s.offset / s.total) * 100}
          showInfo={false}
          status={s.offset !== s.total ? 'active' : undefined}
          strokeColor={s.offset !== s.total ? '#7ea695' : '#7e95a6'}
        />
      )}
      <TracksWithSearch tracks={tracks} loading={loading} editable />
    </>
  )
}
