import { Track } from '../store'

type Disallows = {
  pausing: boolean
  resuming: boolean
  seeking: boolean
  skipping_prev: boolean
  skipping_next: boolean
}

export type CurrentlyPlaying = {
  timestamp: number
  // context: null
  progress_ms: number
  item: Track | null
  currently_playing_type: 'unknown' | string
  actions: {
    disallows: Disallows
  }
  is_playing: boolean
}
