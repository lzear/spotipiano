export type TrackMoment = {
  trackID: string
  positionMs: number
}

export interface LastPressedType extends TrackMoment {
  pressedAt: number
  letter?: string
}

export type Pianote = TrackMoment & { id: string; at: number; pause: false }
export type PianotePause = { id: string; at: number; pause: true }

export type WithEnd = { end: number; duration: number }
