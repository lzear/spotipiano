import React, { EventHandler, SyntheticEvent } from 'react'
import { Pianote, PianotePause, WithEnd } from '../utils/notes'

export const NoteCompTrack: React.FC<{
  note: (Pianote | PianotePause) & WithEnd
  end: number
  mouseUp: EventHandler<SyntheticEvent>
}> = ({ note, end, mouseUp }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <div className="trackrect" onMouseUp={mouseUp} role="cell">
    <style jsx>{`
      .trackrect {
        background: ${note.pause ? 'transparent' : '#cf96b3'};
        height: 10px;
        border: 1px solid blue;
        cursor: pointer;
        position: absolute;
        left: ${100 * (note.at / end)}%;
        width: ${100 * ((note.duration || 10) / end)}%;
      }
    `}</style>
  </div>
)

export const boundaries = (partition: (Pianote | PianotePause)[]) =>
  partition.reduce((acc, cur) => {
    if (acc.length) {
      acc[acc.length - 1].end = cur.at
      acc[acc.length - 1].duration = cur.at - acc[acc.length - 1].at
    }
    return [...acc, { ...cur, duration: 0, end: 0 }]
  }, [] as ((Pianote | PianotePause) & WithEnd)[])

export const TRACK_HEIGHT = 10
export const KNOB_HEIGHT = 20
