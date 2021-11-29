import { SoundBoardForTrack } from './SoundBoardForTrack'
import { SoundBoardForPlaylist } from './SoundBoardForPlaylist'
import { Track } from '../store'
import React from 'react'

export const MakeDrumsForTracks: React.FC<{
  tracks: Track[] | null
}> = ({ tracks }) => (
  <div className="buttons">
    {!!tracks?.length && <SoundBoardForPlaylist tracks={tracks} />}
    <SoundBoardForTrack />

    <style jsx>{`
      .buttons {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 10px;
      }
    `}</style>
  </div>
)
