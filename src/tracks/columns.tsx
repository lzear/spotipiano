import { ColumnsType } from 'antd/lib/table'
import React from 'react'
import { PlaySquareOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Album, Artist, Track } from '../store'
import { usePlay } from '../spotify/usePlay'
import { humanTime } from '../spotify/Tracks'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'

const Cover: React.FC<{ url: string; name: string }> = ({ url, name }) => (
  <div>
    <img src={url} alt={name} height={48} width={48} />
    <style jsx>{`
      div {
        margin: -8px;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </div>
)

export const defaultColumns = <T extends Track>(
  play: (t: Track) => Promise<void> | null,
): ColumnsType<T> => [
  {
    key: 'cover',
    width: 50,
    render(ttt: Track) {
      const url = getTrackImgUrl(ttt)
      return url ? <Cover url={url} name={ttt.album.name} /> : null
    },
  },
  {
    width: 50,
    render(tt: Track) {
      return (
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => play(tt)}
          icon={<PlaySquareOutlined />}
        />
      )
    },
    key: 'play',
    // shouldCellUpdate: (a, b) => {
    //   return true
    // },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // filtered: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Artist',
    dataIndex: 'artists',
    render: (tt: Artist[]) => tt.map((a) => a.name).join(', '),
    key: 'artist',
    sorter: (a, b) =>
      a.artists
        .map((l) => l.name)
        .join(',')
        .localeCompare(b.artists.map((l) => l.name).join(',')),
  },
  {
    title: 'Album',
    dataIndex: 'album',
    render: (tt: Album) => tt.name,
    key: 'album',
    sorter: (a, b) => a.album.name.localeCompare(b.album.name),
  },
  {
    title: 'Duration',
    render: (tt: Track) => humanTime(tt.duration_ms),
    key: 'duration',
    sorter: (a, b) => a.duration_ms - b.duration_ms,
  },
]

export const useDefaultColumns = <T extends Track>(): ColumnsType<T> => {
  const { play } = usePlay()
  return defaultColumns<T>((track) => play(track.id))
}
