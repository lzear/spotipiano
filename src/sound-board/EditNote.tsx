import { Button, InputNumber, Slider } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { msToHuman } from '../utils/msToHuman'
import { TrackMoment } from '../utils/notes'
import { Track } from '../store'
import { getTrackImgUrl } from '../utils/getTrackImgUrl'
import _ from 'lodash'
import { SpringKey } from '../demo/KeyTile'

const Buttons: React.FC<{
  trackMoment: TrackMoment
  track: Track
  onChange: (post: number) => void
  diff: number
}> = ({ trackMoment, diff, track, onChange }) => {
  const v = trackMoment.positionMs + diff
  const disabled = v < 0 || v >= track.duration_ms
  const p = diff > 0 ? `+${diff}` : diff
  return (
    <Button
      size="small"
      key={diff}
      onClick={() => onChange(Math.round(v))}
      disabled={disabled}
    >
      {p}
    </Button>
  )
}

const SSlider: React.FC<{
  trackMoment: TrackMoment
  track: Track
  onChange: (post: number) => void
}> = ({ trackMoment: key, track, onChange }) => {
  const [po, setPo] = useState(key.positionMs)
  const oChange = useCallback(_.throttle(onChange, 60), [key])
  useEffect(() => setPo(key.positionMs), [key.positionMs])
  return (
    <Slider
      min={0}
      tipFormatter={(v) => (v !== undefined ? msToHuman(v) : null)}
      max={track.duration_ms}
      onChange={(p) => {
        setPo(p)
        oChange(p)
      }}
      value={po}
      step={1}
    />
  )
}

export const EditNote: React.FC<{
  trackMoment: TrackMoment
  track: Track
  letter?: string
  onChange: (post: number) => void
  onClick: () => void
  isLastPressedAt?: false | number
}> = ({
  trackMoment,
  track,
  onChange,
  isLastPressedAt = false,
  onClick,
  letter,
}) => {
  return (
    <>
      {[-1000, -100, -10, -1].map((diff) => (
        <Buttons
          key={diff}
          diff={diff}
          onChange={onChange}
          trackMoment={trackMoment}
          track={track}
        />
      ))}
      <InputNumber
        value={trackMoment.positionMs}
        onChange={onChange}
        min={0}
        max={track.duration_ms}
      />
      {[1, 10, 100, 1000].map((diff) => (
        <Buttons
          key={diff}
          diff={diff}
          onChange={onChange}
          trackMoment={trackMoment}
          track={track}
        />
      ))}

      <div className="row">
        <SpringKey
          letter={letter}
          isLastPressedAt={isLastPressedAt}
          onClick={onClick}
          url={getTrackImgUrl(track)}
          progress={trackMoment.positionMs / track.duration_ms}
        />
        <div
          tabIndex={0}
          role="menu"
          className="col"
          onKeyPress={(e) => {
            if (e.key === 'Enter') onClick()
          }}
        >
          <span>
            {track.name} (<strong>{msToHuman(trackMoment.positionMs)}</strong>)
          </span>
          <SSlider
            trackMoment={trackMoment}
            track={track}
            onChange={onChange}
          />
        </div>
      </div>
      <style jsx>{`
        .row {
          display: flex;
        }
        .col {
          flex: 1 1 auto;
          margin: 10px 0 0 10px;
        }
      `}</style>
    </>
  )
}
