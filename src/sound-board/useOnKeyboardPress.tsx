import { useCallback } from 'react'
import { usePlay } from '../spotify/usePlay'
import { TrackMoment } from '../utils/notes'
import { selectSetLastPressed } from '../store/selectors'
import { useStore } from '../store/zustand'

export const useOnKeyboardPress = (): ((
  letter: string,
  thisKey: TrackMoment,
) => void) => {
  const setLastPressed = useStore(selectSetLastPressed)
  const { play } = usePlay()
  return useCallback(
    (letter: string, thisKey: TrackMoment) => {
      void play(thisKey.trackID, thisKey.positionMs)
      setLastPressed({
        ...thisKey,
        letter,
        pressedAt: Date.now(),
      })
    },
    [play, setLastPressed],
  )
}
