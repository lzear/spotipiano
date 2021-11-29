import React from 'react'
import { TrackMoment } from '../utils/notes'
import { Track } from '../store'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import { SpringKey } from '../demo/KeyTile'

const LetterComp: React.FC<{
  letter: string
  keey: TrackMoment
  isLastPressedAt: number | false
  defaulted?: boolean
  onKey: (letter: string, key: TrackMoment) => void
  track?: Track
}> = ({ letter, keey, isLastPressedAt, onKey, defaulted, track }) => (
  <SpringKey
    key={letter}
    letter={letter}
    progress={track ? keey.positionMs / track.duration_ms : undefined}
    url={getTrackImgUrl(track)}
    onClick={() => onKey(letter, keey)}
    isLastPressedAt={isLastPressedAt}
    defaulted={defaulted}
  />
)

export const Letter = React.memo(LetterComp)
