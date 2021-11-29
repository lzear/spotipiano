import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PauseOutlined,
} from '@ant-design/icons'
import { Button, Popover, Table } from 'antd'
import React, { useMemo } from 'react'
import { Pianote, PianotePause } from '../utils/notes'
import {
  selectdeletePartitionNote,
  selectTracksByID,
  selectupdatePartitionNote,
} from '../store/selectors'
import { Track } from '../store'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import { humanTime } from '../spotify/Tracks'
import { EditNote } from '../sound-board/EditNote'
import { usePlay } from '../spotify/usePlay'
import { useStore } from '../store/zustand'

const ButtonNote: React.FC<{
  note: (Pianote & { track: Track }) | PianotePause
  setActive: (note: Pianote | PianotePause) => void
}> = ({ note, setActive }) => {
  const track = note.pause ? undefined : note.track
  const src = getTrackImgUrl(track)
  return (
    <>
      <button onClick={() => setActive(note)} tabIndex={0}>
        {note.pause ? <PauseOutlined /> : <CaretRightOutlined />}
      </button>
      <style jsx>{`
        button {
          background-image: ${src ? `url("${src}")` : 'gray'};
          background-size: contain;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

const useCols = (setActive: (note: Pianote | PianotePause) => void) => {
  const deleteNote = useStore(selectdeletePartitionNote)
  const updateNote = useStore(selectupdatePartitionNote)
  const { play } = usePlay()
  return useMemo(
    () => [
      {
        render(note: (Pianote & { track: Track }) | PianotePause) {
          return <ButtonNote note={note} setActive={setActive} />
        },
      },
      {
        title: 'Name',
        render(note: (Pianote & { track: Track }) | PianotePause) {
          if (note.pause) return null
          const track = note.track
          return (
            <>
              {track?.name}
              {track && ' - '}
              {track?.artists.map((a) => a.name).join(', ')}
            </>
          )
        },
      },
      {
        title: 'Position in mix',
        render(note: (Pianote & { track: Track }) | PianotePause) {
          return humanTime(note.at, true)
        },
      },
      {
        title: 'Position in track',
        render(note: (Pianote & { track: Track }) | PianotePause) {
          if (note.pause) return null
          return humanTime(note.positionMs, true)
        },
      },
      {
        title: 'Edit',
        render(note: (Pianote & { track: Track }) | PianotePause) {
          if (note.pause) return null
          const track = note.track
          return (
            <Popover
              trigger="click"
              placement="topRight"
              content={
                <EditNote
                  trackMoment={note}
                  track={track}
                  onClick={() => play(note.trackID, note.positionMs)}
                  onChange={(positionMs: number) =>
                    updateNote({ ...note, positionMs })
                  }
                />
              }
            >
              <Button icon={<EditOutlined />} />
            </Popover>
          )
        },
      },
      {
        title: 'Delete',
        render(note: (Pianote & { track: Track }) | PianotePause) {
          return (
            <Button
              onClick={() => deleteNote(note.id)}
              icon={<DeleteOutlined />}
            />
          )
        },
      },
    ],
    [play, updateNote, deleteNote, setActive],
  )
}

export const ListNotes: React.FC<{
  partition: (Pianote | PianotePause)[]
  activeNote: string | null
  setActive: (note: Pianote | PianotePause) => void
}> = ({ partition, activeNote, setActive }) => {
  const tracksById = useStore(selectTracksByID)
  const notes: (((Pianote & { track: Track }) | PianotePause) & {
    active: boolean
  })[] = partition.map((p) => {
    if (p.pause) return { ...p, active: p.id === activeNote }
    return {
      ...p,
      track: tracksById[p.trackID],
      active: activeNote === p.id,
    }
  })

  const cols = useCols(setActive)
  return (
    <Table<
      ((Pianote & { track: Track }) | PianotePause) & {
        active: boolean
      }
    >
      rowSelection={{
        selectedRowKeys: activeNote ? [activeNote] : undefined,
        selections: false,
        renderCell: () => null,
        hideSelectAll: true,
        columnWidth: 0,
      }}
      size="small"
      dataSource={notes}
      rowKey="id"
      columns={cols}
      style={{ marginTop: 10 }}
    />
  )
}
