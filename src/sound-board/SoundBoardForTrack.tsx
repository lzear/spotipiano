import React from 'react'
import { Button } from 'antd'
import type { TrackMoment } from '../utils/notes'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import type { Track } from '../store'
import { selectSetKeys, selectTrack } from '../store/selectors'
import { useStore } from '../store/zustand'
import { letters } from '../demo/SoundBoard'
import { KeyTile } from '../demo/KeyTile'

const makeSoundBoard = (track: Track) =>
  letters.reduce((acc, letter, idx) => {
    const positionMs = Math.floor((idx / letters.length) * track.duration_ms)
    return {
      ...acc,
      [letter]: {
        trackID: track.id,
        positionMs,
      },
    }
  }, {} as { [key: string]: TrackMoment })

export const SoundBoardForTrack: React.FC = () => {
  const track = useStore(selectTrack)
  const setKeys = useStore(selectSetKeys)
  return track ? (
    <Button
      onClick={() => setKeys(makeSoundBoard(track))}
      style={{ display: 'flex', margin: 5 }}
    >
      <KeyTile className="tile" url={getTrackImgUrl(track)} size={24} />
      &nbsp;Keyboard from the current track
    </Button>
  ) : null
}
