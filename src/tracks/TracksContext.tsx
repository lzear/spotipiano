import { UseQueryResult } from 'react-query'
import _ from 'lodash'
import { useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { PlaylistsItem, Track, TrackItem } from '../store'
import { useQueriesTyped } from '../utils/useQueriesTyped'
import { AuthedContext } from '../auth/AuthContext'
import { playlistTracksQueryOptions } from '../spotify/reactQuery'
import { Store, useStore } from '../store/zustand'
import { useAllPlaylists } from '../spotify/Playlists'
import { usePlaylistQueryParams } from './playists/Picker'

const getTrackIds = (
  included: UseQueryResult<TrackItem[]>[],
  excluded: UseQueryResult<TrackItem[]>[],
) => {
  const loading = included.some((v) => !v.data) || excluded.some((v) => !v.data)
  //   return null
  const ex = _.uniq(
    excluded.flatMap((ii) => ii.data?.map((jj) => jj.track.id) || []),
  )
  const trackIDs = included.map((ii) =>
    _.difference(ii.data?.map((jj) => jj.track.id) || [], ex),
  )
  return { trackIDs, loading }
}
const tracksFromExpanded = (
  expandedIncluded: Expanded[],
  expandedExcluded: Expanded[],
  picklist: 'single' | 'union' | 'intersection',
) => {
  const { trackIDs, loading } = getTrackIds(
    expandedIncluded.map((e) => e.tracks),
    expandedExcluded.map((e) => e.tracks),
  )
  const interunion = picklist === 'intersection' ? _.intersection : _.union
  const includedTrackIDs = interunion(...trackIDs)

  const trackById: {
    [trackID: string]: Track & {
      playlistIDs: string[]
      playlists: PlaylistsItem[]
    }
  } = {}
  expandedIncluded.forEach((p) =>
    p.tracks.data?.forEach((trackItem) => {
      if (includedTrackIDs.includes(trackItem.track.id))
        trackById[trackItem.track.id] = {
          ...trackItem.track,
          playlistIDs: [
            ...(trackById[trackItem.track.id]?.playlistIDs || []),
            p.id,
          ],
          playlists: [
            ...(trackById[trackItem.track.id]?.playlists || []),
            ...(p.playlist ? [p.playlist] : []),
          ],
        }
    }),
  )
  return { loading, tracks: Object.values(trackById) }
}

export const useAddTracksToStore = (tracks: Track[]): void => {
  const storedTrackIds = useStore((s) => Object.keys(s.tracksByID), shallow)
  const addTracks = useStore((s) => s.addTracks, shallow)
  useEffect(() => {
    const toAdd = tracks.reduce((acc, track) => {
      if (acc[track.id] || storedTrackIds.includes(track.id)) return acc
      return { ...acc, [track.id]: track }
    }, {} as { [id: string]: Track })

    if (Object.keys(toAdd).length) addTracks(toAdd)
  }, [addTracks, storedTrackIds, tracks])
}

const selectSetPlaylistsLoading = (s: Store) => s.setPlaylistsLoading

const usePlaylistsTracks = (playlistIDs: string[]) => {
  const setPlaylistsLoading = useStore(selectSetPlaylistsLoading)
  const { accessToken } = useContext(AuthedContext)

  const playlistsTracks: UseQueryResult<TrackItem[]>[] = useQueriesTyped(
    playlistIDs.map((id) =>
      playlistTracksQueryOptions(accessToken, id, setPlaylistsLoading),
    ),
  )

  const ttt = playlistsTracks
    .flatMap((pt) => pt.data?.map((t) => t.track))
    .filter(Boolean) as Track[]
  useAddTracksToStore(ttt)

  return playlistsTracks
}

const useExpandPlaylists = ({ playlistIDs }: { playlistIDs: string[] }) => {
  const allPlaylists = useAllPlaylists()
  const playlistsTracks = usePlaylistsTracks(playlistIDs)
  return playlistIDs.map((id, idx) => ({
    id,
    playlist: allPlaylists.data?.find((p) => p.id === id),
    tracks: playlistsTracks[idx],
  }))
}
type Expanded = {
  id: string
  playlist: PlaylistsItem | undefined
  tracks: UseQueryResult<TrackItem[], unknown>
}
export const usePickedPlaylistTracks = (): {
  loading: boolean
  tracks:
    | (Track & { playlistIDs: string[]; playlists: PlaylistsItem[] })[]
    | null
} => {
  const [{ idsIn, idsOut, picklist }] = usePlaylistQueryParams()
  const expandedPlaylists = useExpandPlaylists({
    playlistIDs: [...idsIn, ...idsOut],
  })
  if (!expandedPlaylists) return { loading: true, tracks: null }
  const expandedIncluded = expandedPlaylists.slice(0, idsIn.length)
  const expandedExcluded = expandedPlaylists.slice(idsIn.length)
  return tracksFromExpanded(expandedIncluded, expandedExcluded, picklist)
}
