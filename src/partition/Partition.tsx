import React, { MouseEventHandler, useEffect, useMemo, useRef } from 'react'
import { Affix, Button, Space, Typography } from 'antd'
import { animated, SpringRef, SpringValue } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import _ from 'lodash'
import { Pianote, PianotePause, WithEnd } from '../utils/notes'
import { PartitionTrack } from './Record'
import { StopIcon } from '../layout/icons/StopIcon'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'
import { getEndTime } from './sort'
import { boundaries, KNOB_HEIGHT, NoteCompTrack, TRACK_HEIGHT } from './Notes'
import { VignetteWithGesture } from './Vignette'
import { useStore } from '../store/zustand'
import { selectScreenWidth } from '../store/selectors'

const NoteCompVignette: React.FC<{
  note: (Pianote | PianotePause) & WithEnd
  clickNote: (note: Pianote | PianotePause) => void
  duration?: number | null
  active: boolean
  end: number
  maxX: number
}> = ({ note, active, end, maxX, clickNote }) => (
  <div className="inner">
    <VignetteWithGesture
      note={note}
      maxX={maxX}
      end={end}
      clickNote={clickNote}
    />
    <style jsx>{`
      .inner {
        position: absolute;
        left: ${100 * (note.at / end)}%;
        width: ${100 * ((note.duration || 10) / end)}%;
        transition: top 0.1s;
        top: ${active ? 40 : 20}px;
        z-index: ${active ? 2 : 1};
      }
    `}</style>
  </div>
)

const { Title } = Typography

export const Partition: React.FC<{
  partition: (Pianote | PianotePause)[]
  api: SpringRef<{ x: number }>
  x: SpringValue<number>
  startFrom: (time: number) => void
  currentNote: string | null
  playing: boolean
  pausedAt: number
  setPauseAt: (_pauseAt?: number) => void
}> = ({
  partition: _partition,
  x,
  api,
  setPauseAt,
  startFrom,
  currentNote,
  playing,
  pausedAt,
}) => {
  const partition = useMemo(() => boundaries(_partition), [_partition])

  const end = getEndTime(partition)

  const componentRef = useRef<HTMLDivElement>(null)
  const width = useStore(selectScreenWidth)
  const maxX = width || 600

  const bind = useDrag(
    ({ movement: [mx], active }) => {
      // if (active) api.start({ x: (mx / maxX) * end, immediate: true })
      if (active) api.start({ x: (mx / maxX) * end, immediate: true })
      else (playing ? startFrom : setPauseAt)((mx / maxX) * end)
    },
    {
      initial: () => [
        playing ? (x.get() / end) * maxX : (pausedAt / end) * maxX,
        0,
      ],
      axis: 'x',
      bounds: { left: 0, right: width || 0 },
    },
  )

  const mouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!componentRef.current) return
    const u = e.clientX - componentRef.current.getBoundingClientRect().x
    const c = _.clamp(u / maxX, 0, 1)
    if (playing) startFrom(c * end)
    else setPauseAt(c * end)
  }
  const clickNote = (note: Pianote | PianotePause) => {
    if (playing) startFrom(note.at)
    else setPauseAt(note.at)
  }

  const sss = useRef<HTMLElement | null | undefined>()
  useEffect(() => {
    sss.current = document.getElementById('scroll')
  }, [])
  return (
    <div>
      <div className="pbar" ref={componentRef}>
        <PartitionTrack height={TRACK_HEIGHT}>
          {partition.map((note) => (
            <NoteCompTrack
              mouseUp={mouseUp}
              key={note.id}
              end={end}
              note={note}
            />
          ))}
          {partition.map((note) => (
            <NoteCompVignette
              clickNote={clickNote}
              maxX={maxX}
              key={note.id}
              end={end}
              note={note}
              duration={note.duration}
              active={currentNote === note.id}
            />
          ))}
          <animated.div
            {...bind()}
            key="knob"
            className="knob"
            aria-label="Progress bar knob"
            style={{ x: x.to([0, end], [0, maxX]) }}
          />
        </PartitionTrack>
        <div className="hint-drag">You can drag the notes</div>
      </div>
      <Title level={4}>Play the partition</Title>
      <Affix
        style={{ pointerEvents: 'none' }}
        offsetBottom={20}
        offsetTop={20}
        target={() => sss.current || null}
      >
        <Space style={{ pointerEvents: 'none' }}>
          {playing ? (
            <Button
              size="large"
              style={{ pointerEvents: 'all' }}
              onClick={() => setPauseAt()}
            >
              <PauseOutlined />
            </Button>
          ) : (
            <Button
              size="large"
              style={{ pointerEvents: 'all' }}
              onClick={() => startFrom(pausedAt)}
            >
              <CaretRightOutlined />
            </Button>
          )}
          <Button
            size="large"
            style={{ pointerEvents: 'all' }}
            onClick={() => setPauseAt(0)}
          >
            <StopIcon />
          </Button>
        </Space>
      </Affix>
      <style jsx>{`
        .hint-drag {
          text-align: right;
          font-style: italic;
        }
        .pbar {
          height: ${TRACK_HEIGHT}px;
          margin-bottom: 200px;
        }
        :global(.knob) {
          z-index: 2;
          cursor: pointer;
          position: absolute;
          top: ${(TRACK_HEIGHT - KNOB_HEIGHT) / 2}px;
          left: -${KNOB_HEIGHT / 2}px;
          width: ${KNOB_HEIGHT}px;
          height: ${KNOB_HEIGHT}px;
          border-radius: 50%;
          background: white;
          border: 1px solid #555;
        }
      `}</style>
    </div>
  )
}
