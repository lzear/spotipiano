import React, { useMemo } from 'react'
import { Button, Typography } from 'antd'
import { SpringValue } from '@react-spring/web'
import { Pianote, PianotePause } from '../utils/notes'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ListNotes } from './ListNotes'
import { selectInsertPartitionNote, selectPlayState } from '../store/selectors'
import rString from '../utils/rString'
import { boundaries } from './Notes'
import { Partition } from './Partition'
import { usePlayPartition } from './usePlayPartition'
import { useStore } from '../store/zustand'

const { Title } = Typography

export const PartitionEditor: React.FC<{
  partition: (Pianote | PianotePause)[]
}> = ({ partition: _partition }) => {
  const partition = useMemo(() => boundaries(_partition), [_partition])

  const { setPauseAt, startFrom, currentNote, playing, pausedAt, x, api } =
    usePlayPartition(partition)

  const insertPartitionNote = useStore(selectInsertPartitionNote)

  return (
    <>
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

      <Title level={4} style={{ marginTop: 25 }}>
        Add to the partition
      </Title>
      <Button
        icon={<PlusSquareOutlined />}
        onClick={() =>
          insertPartitionNote({
            id: rString(),
            at: Math.round(x.get()),
            pause: true,
          })
        }
      >
        Add Pause
      </Button>
      <AddCurentlyPlaying x={x} />
      <Title level={4} style={{ marginTop: 25 }}>
        Notes
      </Title>
      <ListNotes
        partition={partition}
        activeNote={currentNote}
        setActive={(note: Pianote | PianotePause) => {
          if (playing) startFrom(note.at)
          else setPauseAt(note.at)
        }}
      />
    </>
  )
}

export const AddCurentlyPlaying: React.FC<{ x: SpringValue<number> }> = ({
  x,
}) => {
  const playState = useStore(selectPlayState)
  const insertPartitionNote = useStore(selectInsertPartitionNote)

  return (
    <Button
      icon={<PlusSquareOutlined />}
      disabled={!playState}
      onClick={() =>
        playState &&
        insertPartitionNote({
          id: rString(),
          at: Math.round(x.get()),
          trackID: playState.track.id,
          positionMs: playState.positionMs,
          pause: false,
        })
      }
    >
      Add currently playing
    </Button>
  )
}
