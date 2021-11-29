import React, { useContext, useEffect } from 'react'
import { Layout } from 'antd'
import { Currently } from './Currently'
import { Buttons } from './Buttons'
import { PlayBar, usePutSpring } from './Playbar'
import { PlayState, Store, useStore } from '../store/zustand'
import { ZTrackContext } from '../tracks/ZTracks'
import { humanTime } from '../spotify/Tracks'
import { animated } from '@react-spring/web'

const { Footer } = Layout

const selectPlayState = (s: Store) => s.playState

const Foot: React.FC<{ playState: PlayState }> = ({ playState }) => {
  const { fetchTracks } = useContext(ZTrackContext)
  useEffect(() => {
    if (playState.track.id) fetchTracks([playState?.track.id])
  }, [fetchTracks, playState.track.id])

  const [{ x }, api] = usePutSpring()

  return (
    <Footer id="footer">
      <div className="over">
        <Currently playState={playState} />
        <Buttons playState={playState} />
        <div className="right">
          <animated.span>
            {x.to((n) => humanTime(n * playState.track.duration_ms))}
          </animated.span>
          &nbsp;/&nbsp;{humanTime(playState.track.duration_ms)}
        </div>
      </div>
      <PlayBar played={playState} api={api} x={x} />

      <style jsx>{`
        a {
          margin-right: 25px;
        }
        .right {
          color: #ccc;
          justify-content: flex-end;
          align-content: space-around;
          align-items: center;
          align-self: flex-end;
        }
        .left,
        .right {
          flex: 1 0 0px;
          display: flex;
          min-width: -webkit-min-content; /* Workaround to Chrome bug */
        }
        .left {
          margin-right: auto;
        }
        .right {
          margin-left: auto;
        }
        :global(#footer) {
          display: flex;
          justify-content: space-around;
          flex: 0 0 auto;
          flex-direction: column;

          background: #001529;
          padding: 10px;
        }
        .over {
          justify-content: center;
          display: flex;
        }
      `}</style>
    </Footer>
  )
}

export const FootWrapper: React.FC = () => {
  const playState = useStore(selectPlayState)

  return playState && <Foot playState={playState} />
}

export default FootWrapper
