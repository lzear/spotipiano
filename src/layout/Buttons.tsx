import React from 'react'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { usePlay } from '../spotify/usePlay'
import { PlayState } from '../store/zustand'

export const Buttons: React.FC<{ playState: PlayState }> = ({ playState }) => {
  const { play, pause } = usePlay()
  const isPlaying = !!playState?.playedAt

  return (
    <div>
      <Button
        type="primary"
        onClick={
          isPlaying
            ? pause
            : (playState &&
                (() => play(playState.track.id, playState.positionMs))) ||
              undefined
        }
        // disabled={playState?.playedAt === null}
        icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      />
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
          padding: 0 10px;
        }
        .right {
          display: flex;
          // flex=direction: column;
          flex-direction: column;
          padding-left: 10px;

          align-items: flex-start;
        }
        .track-name {
          font-weight: 500;
        }
        .artist {
        }
      `}</style>
    </div>
  )
}
