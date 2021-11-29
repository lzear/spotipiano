import React from 'react'
import { PlayState, Store, useStore } from '../store/zustand'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import { Like } from '../tracks/Like'
import { KeyTile } from '../demo/KeyTile'

const selectX = (s: Store) => s.x

export const Currently: React.FC<{ className?: string; playState: PlayState }> =
  ({ playState }) => {
    const tt = useStore(selectX)
    return (
      <div className="main">
        <KeyTile
          className="tile"
          url={playState ? getTrackImgUrl(playState.track) : undefined}
          progress={tt}
        />
        <div className="right">
          {playState && (
            <div className="track-name">{playState.track.name}</div>
          )}
          {playState && (
            <div className="artist">
              {playState.track.artists.map((a) => a.name).join(' & ')}
            </div>
          )}
        </div>
        <div className="like">
          <Like track={playState.track} />
        </div>
        <style jsx>{`
          .main {
            display: flex;
            align-items: center;
            flex: 1 0 0px;
            color: #fff;
          }
          .right {
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            align-items: flex-start;
          }
          .like {
            margin-left: 15px;
          }
          .track-name {
            font-weight: 500;
          }
        `}</style>
      </div>
    )
  }
