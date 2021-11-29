import _ from 'lodash'
import React, { createContext, useCallback, useRef } from 'react'
import shallow from 'zustand/shallow'
import { SpotifyQuerier } from '../spotify/SpotifyQuerier'
import { useStore } from '../store/zustand'
import { selectAccessToken, selectAddTracks } from '../store/selectors'

export const ZTrackContext = createContext<{
  fetchTracks: (ids: string[]) => void
}>({ fetchTracks: () => null })

const fetchBatch = async (accessToken: string, thisBatch: string[]) =>
  SpotifyQuerier.getTracks(accessToken, thisBatch)

export const ZTracks: React.FC = ({ children }) => {
  const accessToken = useStore(selectAccessToken)
  const addTracks = useStore(selectAddTracks)
  const savedTrackIDs = useStore((s) => Object.keys(s.tracksByID), shallow)
  const beingFetched = useRef<string[]>([])

  const fetchTracks = useCallback(
    (ids: string[]) => {
      const reallyToFetch = _.uniq(
        _.difference(ids, [...savedTrackIDs, ...beingFetched.current]),
      )

      if (reallyToFetch.length && accessToken) {
        const chunks = _.chunk(reallyToFetch, 50)
        beingFetched.current.push(...reallyToFetch)
        chunks.forEach(async (trackIds) => {
          const tracks = await fetchBatch(accessToken, trackIds)
          addTracks(_.keyBy(tracks, 'id'))
        })
      }
    },
    [accessToken, addTracks, savedTrackIDs],
  )
  return (
    <ZTrackContext.Provider value={{ fetchTracks }}>
      {children}
    </ZTrackContext.Provider>
  )
}
