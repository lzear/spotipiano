import _ from 'lodash'
import React from 'react'
import { Button } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { TrackMoment } from '../utils/notes'
import { Track } from '../store'
import { selectSetKeys } from '../store/selectors'
import { useStore } from '../store/zustand'
import { letters } from '../demo/SoundBoard'

const makeSoundBoard = (tracks: Track[]) =>
  letters.reduce((acc, letter) => {
    const track = _.sample(tracks)
    if (!track) return acc
    const positionMs = Math.floor(Math.random() * track.duration_ms)
    return {
      ...acc,
      [letter]: {
        trackID: track.id,
        positionMs,
      },
    }
  }, {} as { [key: string]: TrackMoment })

export const SoundBoardForPlaylist: React.FC<{ tracks: Track[] }> = ({
  tracks,
}) => {
  const setKeys = useStore(selectSetKeys)
  return (
    <Button
      onClick={() => setKeys(makeSoundBoard(tracks))}
      icon={<TableOutlined />}
      style={{ margin: 5 }}
    >
      Make a keyboard from the tracks above
    </Button>
  )
}
