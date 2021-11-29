import type { Store } from './zustand'

export const selectSetPlayState = (s: Store) => s.setPlayState

export const selectPlayState = (s: Store) => s.playState

export const selectAccessToken = (s: Store) => s.auth?.accessToken

export const selectAuth = (s: Store) => s.auth

export const selectUpdateKey = (s: Store) => s.updateKey

export const selectSetAuth = (s: Store) => s.setAuth

export const selectAddTracks = (s: Store) => s.addTracks

export const selectSetPartition = (s: Store) => s.setPartition

export const selectPartition = (s: Store) => s.partition

export const selectSetKeys = (s: Store) => s.setKeys

export const selectSetDeviceID = (s: Store) => s.setDeviceID

export const selectSetNoAutoDevice = (s: Store) => s.setNoAutoDevice
export const selectNoAutoDevice = (s: Store) => s.noAutoDevice

export const selectDeviceID = (s: Store) => s.deviceID

export const selectTrack = (s: Store) => s.playState?.track

export const selectDrumboxKeys = (s: Store) => s.soundBoard.keys

export const selectScreenWidth = (s: Store) => s.screenWidth

export const selectSetScreenWidth = (s: Store) => s.setScreenWidth

export const selectSetLastPressed = (s: Store) => s.setLastPressed

export const selectRecording = (s: Store) => s.recording
export const selectStartRecord = (s: Store) => s.startRecord
export const selectEndRecord = (s: Store) => s.endRecord

export const selectTracksByID = (s: Store) => s.tracksByID

export const selectupdatePartitionNote = (s: Store) => s.updatePartitionNote

export const selectdeletePartitionNote = (s: Store) => s.deletePartitionNote

export const selectInsertPartitionNote = (s: Store) => s.insertPartitionNote
