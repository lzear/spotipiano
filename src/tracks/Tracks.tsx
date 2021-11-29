import { Spin, Typography } from 'antd'
import React from 'react'
import TracksTable from './TracksTable'
import { useDefaultColumns } from './columns'
import { PlaylistsItem, Track } from '../store'
import { MakeDrumsForTracks } from '../sound-board/MakeDrumbsButtons'

const { Title } = Typography

export const Tracks: React.FC<{
  loading?: boolean
  tracks: Track[] | null
  editable?: boolean
}> = ({ loading = false, tracks, editable }) => {
  const columns = useDefaultColumns<
    Track & { playlistIDs?: string[]; playlists?: PlaylistsItem[] }
  >()

  if (!tracks && loading) return <Spin />

  return (
    <div>
      <TracksTable tracks={tracks || []} columns={columns} loading={loading} />

      {editable && (
        <Title level={2} style={{ marginTop: 30 }}>
          2. Build a soundboard
        </Title>
      )}
      {editable && <MakeDrumsForTracks tracks={tracks} />}
      <style jsx>{`
        .buttons {
          display: flex;
          justify-content: space-evenly;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  )
}
