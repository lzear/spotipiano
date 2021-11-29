import { Pianote, PianotePause } from '../utils/notes'
import { selectupdatePartitionNote } from '../store/selectors'
import { useStore } from '../store/zustand'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import { animated, useSpring } from '@react-spring/web'
import React, { useEffect } from 'react'
import { useDrag } from 'react-use-gesture'

export const VignetteOnclick: React.FC<{ onClick?: () => void }> = ({
  onClick,
  children,
}) => {
  return (
    <div
      className="vignette"
      onClick={onClick}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      {children}
      <style jsx>{`
        .vignette {
          height: 128px;
          border-radius: 4px;
          background: #fff;
          border: solid 1px black;
          position: relative;
          width: max(100%, 300px);
        }
      `}</style>
    </div>
  )
}

export const VignetteWithGesture: React.FC<{
  note: Pianote | PianotePause
  maxX: number
  end: number
  clickNote: (note: Pianote | PianotePause) => void
}> = ({ note, maxX, end, clickNote }) => {
  const [{ x }, api] = useSpring(() => ({
    immediate: true,
    x: 0,
  }))

  useEffect(() => {
    api.start({ x: 0, immediate: true })
  }, [note])

  const updt = useStore(selectupdatePartitionNote)
  const bind = useDrag(
    ({ down, movement: [mx], tap }) => {
      if (tap) clickNote(note)
      if (down) api.start({ x: down ? mx : 0, immediate: down })
      else {
        maxX &&
          updt({
            ...note,
            at: Math.floor(note.at + (mx / maxX) * end),
          })
      }
    },
    { filterTaps: true },
  )
  return (
    <animated.div {...bind()} style={{ x, cursor: 'pointer' }}>
      {note.pause ? <VignettePause /> : <VignettePlay note={note} />}
    </animated.div>
  )
}

export const VignettePlay: React.FC<{
  note: Pianote
  onClick?: () => void
}> = ({ note, onClick }) => {
  const C = onClick ? VignetteOnclick : Vignette
  const track = useStore((s) => s.tracksByID[note.trackID])
  if (!track) return null
  const url = getTrackImgUrl(track)
  return (
    <C onClick={onClick}>
      <div className="img" />
      <div className="text">{track.name}</div>
      <div className="text">{track.artists.map((a) => a.name).join(' & ')}</div>
      <style jsx>{`
        .text {
          overflow: hidden;
          padding: 5px;
        }
        .img {
          width: 64px;
          height: 64px;
          background-image: url(${url});
          background-origin: content-box;
          background-repeat: no-repeat;
          box-sizing: content-box;
        }
      `}</style>
    </C>
  )
}
export const VignettePause: React.FC<{
  onClick?: () => void
}> = ({ onClick }) => {
  const C = onClick ? VignetteOnclick : Vignette
  return (
    <C>
      <div className="text">PAUSE</div>
      <style jsx>{`
        .text {
          overflow: hidden;
          padding: 5px;
        }
      `}</style>
    </C>
  )
}
export const Vignette: React.FC<{ onClick?: () => void }> = ({ children }) => (
  <div className="vignette">
    {children}
    <style jsx>{`
      .vignette {
        user-select: none;
        height: 128px;
        border-radius: 4px;
        background: #fff;
        border: solid 1px black;
        position: relative;
        width: max(100%, 300px);
      }
    `}</style>
  </div>
)
