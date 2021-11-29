import { Button, Popover } from 'antd'
import React from 'react'
import { Store, useStore } from '../store/zustand'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import { EditNote } from './EditNote'
import { EditOutlined } from '@ant-design/icons'
import { selectUpdateKey } from '../store/selectors'
import { SpringKey } from '../demo/KeyTile'

const ss = (s: Store) => {
  const { lastPressed: lp } = s.soundBoard
  const letter = lp?.letter
  if (!lp || !letter) return {}
  return {
    lastPressed: lp,
    track: s.tracksByID[lp.trackID],
    key: s.soundBoard.keys[letter],
  }
}

export const LastPressed: React.FC<{
  letter: string
  onClick: () => void
}> = ({ letter, onClick }) => {
  const updateKey = useStore(selectUpdateKey)
  const { track, key, lastPressed } = useStore(ss)

  if (!lastPressed || !track || !key) return null

  return (
    <>
      <SpringKey
        onClick={onClick}
        url={getTrackImgUrl(track)}
        progress={key.positionMs / track.duration_ms}
        letter={letter}
        isLastPressedAt={lastPressed.letter === letter && lastPressed.pressedAt}
      />
      <Popover
        trigger="click"
        placement="topRight"
        content={
          <EditNote
            trackMoment={key}
            letter={letter}
            track={track}
            isLastPressedAt={
              lastPressed.letter === letter && lastPressed.pressedAt
            }
            onClick={onClick}
            onChange={(positionMs: number) => updateKey(letter, positionMs)}
          />
        }
      >
        <Button size="small" type="link" icon={<EditOutlined />}>
          Edit
        </Button>
      </Popover>
    </>
  )
}
