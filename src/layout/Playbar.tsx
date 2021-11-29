import React, { useEffect, useRef } from 'react'
import { useDrag } from 'react-use-gesture'
import { animated, SpringRef, SpringValue, useSpring } from '@react-spring/web'
import _ from 'lodash'
import cx from 'classnames'
import { usePlay } from '../spotify/usePlay'
import { PlayState, useStore } from '../store/zustand'
import { selectScreenWidth } from '../store/selectors'

const TRACK_HEIGHT = 18
const KNOB_HEIGHT = 35

const clamp = (v: number) => _.clamp(v, 0, 1)

const elapsedP = (played: PlayState) =>
  (played.positionMs +
    (played.playedAt ? Date.now() - +new Date(played.playedAt) : 0)) /
  played.track.duration_ms

const playStateToSpring = (playState?: PlayState | null) => {
  if (playState && playState.playedAt !== null)
    return {
      from: { x: elapsedP(playState) },
      to: { x: 1 },
      config: {
        duration: playState.track.duration_ms - playState.positionMs,
      },
    }

  if (playState) return { x: elapsedP(playState), immediate: true }

  return { x: 0, immediate: true }
}

export const usePutSpring = () => {
  const [{ x }, api] = useSpring<{ x: number }>(() =>
    playStateToSpring(useStore.getState().playState),
  )

  const setX = useStore((s) => s.setX)
  useEffect(() => {
    setX(x)
    return useStore.subscribe(
      ({ playState }): PlayState | null => playState,
      (playState: PlayState | null) => {
        api.start(playStateToSpring(playState))
      },
    )
  }, [api, setX, x])

  return [{ x }, api] as const
}

export const PlayBar: React.FC<{
  played: PlayState
  className?: string
  x: SpringValue<number>
  api: SpringRef<{ x: number }>
}> = ({ played, className, x, api }) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const width = (useStore(selectScreenWidth) || 100) + 20

  const { play } = usePlay()
  const maxX = width - KNOB_HEIGHT

  const pplay = (xx: number, diffMs = 0) => {
    const p = clamp(xx)
    const ms = played.track.duration_ms * p + diffMs
    return play(played.track.id, ms)
  }
  const bind = useDrag(
    ({ movement: [mx], active }) => {
      if (active && played.playedAt)
        api.start({ x: mx / maxX, immediate: true })
    },
    {
      initial: () => [(played.positionMs / played.track.duration_ms) * maxX, 0],
      axis: 'x',
      bounds: { left: 0, right: width ? width - KNOB_HEIGHT : 0 },
    },
  )

  return (
    <div
      ref={componentRef}
      className={cx('track', className)}
      role="slider"
      onMouseUp={(e) => {
        const px =
          e.clientX -
          e.currentTarget.getBoundingClientRect().x -
          KNOB_HEIGHT / 2
        void pplay(px / maxX)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') void pplay(x.get(), -2000)
        if (e.key === 'ArrowRight') void pplay(x.get(), +2000)
      }}
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={played.track.duration_ms}
      aria-valuenow={played.positionMs}
    >
      <animated.div
        {...bind()}
        className="knob"
        aria-label="Progress bar knob"
        style={{ x: x?.to([0, 1], [0, maxX]) }}
      />
      <style jsx>{`
        .track {
          height: ${TRACK_HEIGHT}px;
          background: #96cfb3;
          border-radius: ${TRACK_HEIGHT / 2}px;
          margin-top: 10px;
          position: relative;
          cursor: pointer;
        }
        .track :global(.knob) {
          cursor: pointer;
          position: absolute;
          top: ${(TRACK_HEIGHT - KNOB_HEIGHT) / 2}px;
          left: 0px;
          width: ${KNOB_HEIGHT}px;
          height: ${KNOB_HEIGHT}px;
          border-radius: 50%;
          background: white;
          border: 1px solid #001529;
        }
      `}</style>
    </div>
  )
}
