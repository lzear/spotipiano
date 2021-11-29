import { SaveOutlined, StopOutlined } from '@ant-design/icons'
import React from 'react'
import { Button } from 'antd'
import { animated, useSpring } from '@react-spring/web'
import { Pianote, PianotePause } from '../utils/notes'
import { humanTime } from '../spotify/Tracks'
import { useStore } from '../store/zustand'
import {
  selectEndRecord,
  selectRecording,
  selectStartRecord,
} from '../store/selectors'
import { VignettePause, VignettePlay } from './Vignette'
import { DotPulse } from '../utils/DotPulse'

const RecordingStart: React.FC = () => {
  return (
    <div>
      Waiting for the first note
      <DotPulse />
    </div>
  )
}
export const PartitionTrack: React.FC<{
  ref?: React.RefObject<HTMLDivElement>
  height?: number
}> = ({ children, ref }) => (
  <div ref={ref}>
    {children}
    <style jsx>{`
      div {
        margin-top: 20px;
        width: 100%;
        height: 165px;
        position: relative;
      }
    `}</style>
  </div>
)
const step = 10000

const RNoteRecord: React.FC = () => (
  <div>
    <style jsx>{`
      div {
        width: 100%;
        background: red;
        height: 10px;
        border: 1px solid blue;
      }
    `}</style>
  </div>
)

const NotesComponent: React.FC<{
  notes: (Pianote | PianotePause)[]
  startOffset: number
}> = ({ notes, startOffset }) => {
  const { val } = useSpring({
    from: { val: Date.now() },
    to: { val: Date.now() + step },
    config: {
      duration: step,
    },
    loop: () => ({ val: Date.now() + step }),
  })
  return (
    <div>
      <animated.div>{val.to((n) => humanTime(n - startOffset))}</animated.div>
      <PartitionTrack>
        {notes.map((note, idx) => {
          const nextNote: PianotePause | Pianote | undefined = notes[idx + 1]
          return (
            <animated.div
              key={note.id}
              style={{
                // background: 'red',
                // border: '1px solid blue',
                // opacity: 0.5,
                position: 'absolute',
                // height: 10,
                left: val.to(
                  (vv) =>
                    `${
                      (note.at - startOffset) *
                      (vv ? 100 / (vv - startOffset) : 0)
                    }%`,
                ),
                width: val.to((vv) => {
                  const noteDuration = (nextNote ? nextNote.at : vv) - note.at
                  const fullDuration = vv - startOffset || Infinity
                  return `${noteDuration * (100 / fullDuration)}%`
                }),
              }}
            >
              <RNoteRecord />
              {note.pause ? <VignettePause /> : <VignettePlay note={note} />}
            </animated.div>
          )
        })}
      </PartitionTrack>
    </div>
  )
}

const RecordLine: React.FC = () => {
  const recording = useStore((s) => s.recording)
  if (!recording.started) return null
  const lastNote = recording.notes?.[recording.notes.length - 1]
  if (!lastNote || !recording.notes) return <RecordingStart />

  return (
    <NotesComponent
      notes={recording.notes}
      startOffset={recording.notes[0].at}
    />
  )
}

export const Record: React.FC = () => {
  const recording = useStore(selectRecording)
  const startRecord = useStore(selectStartRecord)
  const endRecord = useStore(selectEndRecord)
  return (
    <>
      <div className="button-container">
        {recording.started ? (
          <Button onClick={() => endRecord()} icon={<StopOutlined />}>
            Stop recording
          </Button>
        ) : (
          <Button
            size="large"
            type="primary"
            onClick={() => startRecord()}
            icon={<SaveOutlined />}
          >
            Record a partition
          </Button>
        )}
      </div>
      {recording.started && <RecordLine />}
      <style jsx>{`
        .button-container {
          margin-top: 30px;
          text-align: center;
        }
      `}</style>
    </>
  )
}
