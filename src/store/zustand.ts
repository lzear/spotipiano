import create, { GetState, SetState, StateCreator } from 'zustand'
import type { Auth } from '../auth/AuthContext'
import rString from '../utils/rString'
import type { Track } from './index'
import type {
  LastPressedType,
  Pianote,
  PianotePause,
  TrackMoment,
} from '../utils/notes'
import type { SpringValue } from '@react-spring/web'
import { sanitizePartition } from '../partition/sort'
import {
  StoreApiWithSubscribeWithSelector,
  subscribeWithSelector,
} from 'zustand/middleware'

export type PlayState = {
  track: Track
  playedAt: number | null
  positionMs: number
}

type RecordNull = {
  started: false
  notes: null
  endedAt: null
}
export type RecordStarted = {
  started: true
  notes: null
  endedAt: null | number
}
export type RecordOngoing = {
  started: true
  notes: (Pianote | PianotePause)[]
  endedAt: null
}
export type Recordd = RecordNull | RecordStarted | RecordOngoing
export type Store = {
  x: SpringValue<number> | null
  setX: (x: SpringValue<number> | null) => void

  auth: Auth | null
  setAuth: (auth: Auth | null) => void

  deviceID: string | null
  setDeviceID: (deviceID: string | null) => void
  setNoAutoDevice: () => void
  noAutoDevice: boolean

  playState: PlayState | null
  setPlayState: (playState: PlayState | null) => void

  soundBoard: {
    keys: { [key: string]: TrackMoment | null }
    lastPressed: LastPressedType | null
  }
  setKey: (letter: string, key: TrackMoment | null) => void
  updateKey: (letter: string, positionMs: number) => void
  setKeys: (keys: { [key: string]: TrackMoment | null }) => void
  setLastPressed: (lastPressed: LastPressedType) => void

  recording: Recordd
  startRecord: () => void
  endRecord: () => void
  addNote: (key: TrackMoment) => void
  addPause: () => void
  stopNote: () => void

  partition: (Pianote | PianotePause)[]
  setPartition: (partition: (Pianote | PianotePause)[]) => void
  updatePartitionNote: (note: Pianote | PianotePause) => void
  insertPartitionNote: (note: Pianote | PianotePause) => void
  deletePartitionNote: (noteId: string) => void

  playlistsLoading: { [id: string]: { total: number | null; offset: number } }
  setPlaylistsLoading: (
    playlistId: string,
    offset: number,
    total: number | null,
  ) => void
  tracksByID: { [id: string]: Track }
  addTracks: (tracks: { [id: string]: Track }) => void

  screenWidth: number | undefined
  setScreenWidth: (width?: number) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log =
  <T extends Store>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        set(args)
      },
      get,
      api,
    )

export const useStore = create<
  Store,
  SetState<Store>,
  GetState<Store>,
  StoreApiWithSubscribeWithSelector<Store>
>(
  subscribeWithSelector(
    (set): Store => ({
      playlistsLoading: {},
      setPlaylistsLoading: (playlistId, offset, total) =>
        set(({ playlistsLoading }) => ({
          playlistsLoading: {
            ...playlistsLoading,
            [playlistId]: { offset, total },
          },
        })),
      x: null,
      setX: (x: SpringValue<number> | null) => set({ x }),

      auth: null,
      setAuth: (auth) => set({ auth }),

      deviceID: null,
      setDeviceID: (deviceID) => set({ deviceID }),
      setNoAutoDevice: () => set({ noAutoDevice: true, deviceID: null }),
      noAutoDevice: false,

      playState: null,
      setPlayState: (playState) => set({ playState }),

      soundBoard: { keys: {}, lastPressed: null },
      setKey: (letter, key) =>
        set(({ soundBoard }) => ({
          soundBoard: {
            ...soundBoard,
            keys: { ...soundBoard.keys, [letter]: key },
          },
        })),
      updateKey: (letter, positionMs) =>
        set(({ soundBoard }) => {
          const k = soundBoard.keys[letter]
          if (!(soundBoard.keys[letter] && k)) return { soundBoard }
          return {
            soundBoard: {
              ...soundBoard,
              keys: {
                ...soundBoard.keys,
                [letter]: {
                  ...k,
                  positionMs,
                },
              },
            },
          }
        }),
      setKeys: (keys) => set({ soundBoard: { lastPressed: null, keys } }),
      setLastPressed: (lastPressed) =>
        set(({ soundBoard }) => ({
          soundBoard: { ...soundBoard, lastPressed },
        })),

      recording: {
        started: false,
        notes: null,
        endedAt: null,
      },
      startRecord: () =>
        set({
          recording: { started: true, endedAt: null, notes: null },
        }),
      endRecord: () =>
        set(({ recording }) => {
          const now = Date.now()
          let partition: (Pianote | PianotePause)[] = []
          if (recording.notes && recording.notes.length > 0) {
            const firstNoteStart = recording.notes[0].at
            partition = recording.notes.map((note) => ({
              ...note,
              at: note.at - firstNoteStart,
            }))
            partition.push({
              id: rString(),
              at: now - firstNoteStart,
              pause: true,
            })
          }
          return {
            recording: {
              started: false,
              notes: null,
              endedAt: null,
            },
            partition,
          }
        }),
      addNote: (note) => {
        const now = Date.now()
        set(({ recording }) => ({
          recording: {
            started: true,
            endedAt: null,
            notes: [
              ...(recording.notes || []),
              { ...note, id: rString(), at: now, pause: false },
            ],
          },
        }))
      },
      addPause: () => {
        const now = Date.now()
        set(({ recording }) => {
          const lastNote = recording.notes?.at(-1)
          if (lastNote && !lastNote.pause)
            return {
              recording: {
                started: true,
                endedAt: null,
                notes: [
                  ...(recording.notes || []),
                  { id: rString(), at: now, pause: true },
                ],
              },
            }
          return { recording }
        })
      },
      stopNote: () => {
        set(({ recording }) => ({
          recording: recording.started
            ? {
                started: true,
                endedAt: null,
                notes: recording.notes || [],
              }
            : { started: false, endedAt: null, notes: null },
        }))
      },

      partition: [],
      setPartition: (partition) => set({ partition }),
      updatePartitionNote: (note) => {
        set(({ partition }) => ({
          partition: partition
            ? sanitizePartition(
                partition.map((_note) => (_note.id === note.id ? note : _note)),
              )
            : partition,
        }))
      },
      insertPartitionNote: (note) => {
        set(({ partition }) => ({
          partition: partition
            ? sanitizePartition([...partition, note])
            : partition,
        }))
      },
      deletePartitionNote: (noteId) => {
        set(({ partition }) => ({
          partition: partition
            ? sanitizePartition(partition.filter((note) => note.id !== noteId))
            : partition,
        }))
      },

      tracksByID: {},
      addTracks: (tracks) =>
        set(({ tracksByID }) => ({
          tracksByID: { ...tracksByID, ...tracks },
        })),

      screenWidth: undefined,
      setScreenWidth: (screenWidth) => set({ screenWidth }),
    }),
  ),
)
