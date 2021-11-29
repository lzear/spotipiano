import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SpringRef, SpringValue, useSpring } from '@react-spring/web'
import { usePlay } from '../spotify/usePlay'
import { Pianote, PianotePause, WithEnd } from '../utils/notes'
import { selectSetLastPressed } from '../store/selectors'
import { getEndTime, getNoteAtTime } from './sort'
import { Partition } from './Partition'
import { useStore } from '../store/zustand'

export const usePlayPartition: (
  partition: ((Pianote & WithEnd) | (PianotePause & WithEnd))[],
) => {
  startFrom: (time: number) => void
  currentNote: string | null
  playing: boolean
  pausedAt: number
  setPauseAt: (_pauseAt?: number) => void
  x: SpringValue<number>
  api: SpringRef<{ x: number }>
} = (partition: ((Pianote | PianotePause) & WithEnd)[]) => {
  const end = getEndTime(partition)
  const setLastPressed = useStore(selectSetLastPressed)
  const { play, pause } = usePlay()
  const [playing, setPlayling] = useState<boolean>(false)
  const [pausedAt, setPausedAt] = useState<number>(0)

  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [{ x }, api] = useSpring(() => ({
    x: pausedAt,
    immediate: true,
  }))

  const playCurrentNote = (start: number) => {
    const currentNoteCandidate = getNoteAtTime(partition, start)

    if (currentNoteCandidate) {
      setCurrentNote(currentNoteCandidate.id)
      if (!currentNoteCandidate.pause)
        return play(
          currentNoteCandidate.trackID,
          currentNoteCandidate.positionMs + start - currentNoteCandidate.at,
        )
    }
  }

  const timeOutHandles = useRef<NodeJS.Timeout[]>([])

  const clearHandles = () => {
    timeOutHandles.current.forEach((h) => clearTimeout(h))
    timeOutHandles.current = []
  }
  useEffect(() => clearHandles, [])
  const startFrom = useCallback(
    (time: number) => {
      clearHandles()
      const nextNoteIdx = partition.findIndex((note) => note.at > time)
      const nextNotes = partition.slice(nextNoteIdx)
      void playCurrentNote(time)
      nextNotes.forEach((note) => {
        const h = setTimeout(() => {
          setCurrentNote(note.id)
          if (note.pause) {
            void pause()
          } else {
            setLastPressed({ ...note, pressedAt: Date.now() })
            void play(note.trackID, note.positionMs)
          }
        }, note.at - time)
        timeOutHandles.current.push(h)
      })
      setPlayling(true)
      api.start({
        from: { x: time },
        to: { x: end },
        config: { duration: end - time },
      })
      setPausedAt(0)
    },
    [partition],
  )
  const setPauseAt = (_pauseAt?: number) => {
    setPlayling(false)
    const pauseAt = _pauseAt ?? x.get()
    clearHandles()
    setPausedAt(pauseAt)
    void pause()
    api.start({
      from: { x: pauseAt },
      immediate: true,
    })
    setCurrentNote(getNoteAtTime(partition, pauseAt)?.id || null)
  }

  return { setPauseAt, startFrom, currentNote, playing, pausedAt, x, api }
}

export const PWith: React.FC<{
  partition: ((Pianote & WithEnd) | (PianotePause & WithEnd))[]
}> = ({ partition }) => {
  const { setPauseAt, startFrom, currentNote, playing, pausedAt, x, api } =
    usePlayPartition(partition)

  return (
    <Partition
      partition={partition}
      api={api}
      x={x}
      startFrom={startFrom}
      currentNote={currentNote}
      playing={playing}
      pausedAt={pausedAt}
      setPauseAt={setPauseAt}
    />
  )
}
