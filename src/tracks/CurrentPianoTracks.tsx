import React from 'react'
import _ from 'lodash'
import { TracksWithSearch } from './withSearch'
import { useStore } from '../store/zustand'
import { Track } from '../store'

export const CurrentPianoTracks: React.FC<{
  editable?: boolean
}> = ({ editable }) => (
  <TracksWithSearch
    editable={editable}
    tracks={useStore(
      (s) =>
        _.uniq(
          Object.values(s.soundBoard.keys).map(
            (trackMoment) => trackMoment?.trackID,
          ),
        )
          .map((trackID) => (trackID ? s.tracksByID[trackID] : null))
          .filter(Boolean) as Track[],
    )}
  />
)
