import React, { useCallback, useContext } from 'react'
import { useQueryClient } from 'react-query'
import { AuthedContext } from '../auth/AuthContext'
import { Track } from '../store'
import { Store, useStore } from '../store/zustand'
import { NotificationContext } from '../utils/Notifications'
import { selectDeviceID, selectSetPlayState } from '../store/selectors'
import { SpotifyQuerier } from './SpotifyQuerier'
import { DevicePicker } from '../devices/DeviceSelector'

const urisFromTrackID = (trackID?: string, track?: Track) => {
  if (!trackID) return undefined
  if (track?.uri) return [track?.uri]
  return [`spotify:track:${trackID}`]
}

const sStarted = (s: Store) => s.recording.started
const sAddNote = (s: Store) => s.addNote
const sAddPause = (s: Store) => s.addPause

export const usePlay: () => {
  play: (trackID?: string, positionMs?: number) => Promise<void>
  pause: () => Promise<void>
} = () => {
  const queryClient = useQueryClient()
  const addNote = useStore(sAddNote)
  const addPause = useStore(sAddPause)
  const recordingStarted = useStore(sStarted)
  const { accessToken } = useContext(AuthedContext)
  const setPlayState = useStore(selectSetPlayState)
  const deviceID = useStore(selectDeviceID)
  const api = useContext(NotificationContext)
  const pause = useCallback(async () => {
    queryClient.removeQueries('currently-playing')
    void SpotifyQuerier.pause(accessToken)

    if (recordingStarted) addPause()
    const currentPlay = await SpotifyQuerier.currentPlayer(accessToken)
    if (currentPlay)
      setPlayState({
        track: currentPlay.item,
        playedAt: null,
        positionMs: currentPlay.progress_ms,
      })
  }, [accessToken, setPlayState, recordingStarted])
  const play = useCallback(
    async (trackID?: string, positionMs = 0) => {
      queryClient.removeQueries('currently-playing')
      if (recordingStarted && trackID)
        addNote({ trackID: trackID, positionMs: positionMs })
      const trackBIds = useStore.getState().tracksByID
      const track = trackID
        ? (trackBIds[trackID] as Track | undefined)
        : undefined
      const uris = urisFromTrackID(trackID, track)
      try {
        await SpotifyQuerier.play(
          accessToken,
          { uris, position_ms: positionMs },
          deviceID || undefined,
        )
        if (track)
          setPlayState({
            track,
            playedAt: Date.now(),
            positionMs,
          })
      } catch (e) {
        if (!(e instanceof Error)) return
        if (e.message === 'NO_ACTIVE_DEVICE') {
          api.warning({
            closeIcon: <></>,
            placement: 'bottomRight',
            key: 'NO_ACTIVE_DEVICE',
            description: <DevicePicker />,
            message: 'You must select a device before playing a song',
          })
          if (track)
            setPlayState({
              track,
              playedAt: null,
              positionMs,
            })
        } else if (e.message === 'SLOW_DOWN')
          api.warning({
            placement: 'bottomRight',
            message: 'Slow down',
            description: 'The spotify API does not allow so many requests',
          })
        else if (e.message)
          api.warning({
            key: e.message,
            placement: 'bottomRight',
            message: 'Error',
            description: e.message,
          })
      }
    },
    [accessToken, deviceID, setPlayState, api, recordingStarted],
  )
  return { pause, play }
}
