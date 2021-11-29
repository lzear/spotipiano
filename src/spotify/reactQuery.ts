import {
  QueryFunction,
  QueryFunctionContext,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { Page, PlaylistsItem, Track, TrackItem } from '../store'
import { CurrentlyPlaying } from './ApiTypes'
import { SpotifyQuerier, URL_PREFIX } from './SpotifyQuerier'
import { LIKED_ID } from '../tracks/playists/Picker'

export const getPlaylists = async (
  context: QueryFunctionContext<[key: string, accessToken: string]>,
) => {
  const [, accessToken] = context.queryKey
  return SpotifyQuerier.accumulate<PlaylistsItem>(
    accessToken,
    `${URL_PREFIX}/me/playlists?limit=50`,
  )
}

export const getCurrentlyPlaying = async (
  context: QueryFunctionContext<[key: string, accessToken: string]>,
): Promise<CurrentlyPlaying | null> => {
  const [, accessToken] = context.queryKey
  return SpotifyQuerier.currentlyPlaying(accessToken)
}

export const search = async (
  context: QueryFunctionContext<[key: string, accessToken: string, q: string]>,
): Promise<{ tracks: Page<Track> }> => {
  const [, accessToken, q] = context.queryKey
  return SpotifyQuerier.search(accessToken, q)
}

export const getPlaylistTracks: (
  cb: (playlistId: string, offset: number, total: number | null) => void,
) => QueryFunction<
  TrackItem[],
  [id: 'playlistTracks', accessToken: string, playlistID: string]
> =
  (cb) =>
  async (
    context: QueryFunctionContext<
      [key: 'playlistTracks', accessToken: string, playlistID: string]
    >,
  ) => {
    const [, accessToken, playlistID] = context.queryKey
    return SpotifyQuerier.accumulate<TrackItem>(
      accessToken,
      playlistID === LIKED_ID
        ? `${URL_PREFIX}/me/tracks?limit=50`
        : `${URL_PREFIX}/playlists/${playlistID}/tracks?limit=50`,
      (offset, total) => cb(playlistID, offset, total),
    )
  }

export const getTracks: QueryFunction<
  Track[],
  ['tracks', { accessToken: string; trackIDs: string[] }]
> = async (
  context: QueryFunctionContext<
    [key: 'tracks', d: { accessToken: string; trackIDs: string[] }]
  >,
) => {
  const [, { accessToken, trackIDs }] = context.queryKey
  return SpotifyQuerier.getTracks(accessToken, trackIDs)
}

export const playlistTracksQueryOptions = (
  accessToken: string,
  playlistID: string,
  cb: (playlistId: string, offset: number, total: number | null) => void,
): UseQueryOptions<
  TrackItem[],
  unknown,
  TrackItem[],
  [id: 'playlistTracks', accessToken: string, playlistID: string]
> => ({
  queryKey: ['playlistTracks', accessToken, playlistID],
  queryFn: getPlaylistTracks(cb),
  enabled: !!accessToken,
  staleTime: Infinity,
})

export const useAddToSaved = (accessToken: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ tracks }: { tracks: Track[] }) => {
      return SpotifyQuerier.addToSaved(
        accessToken || null,
        tracks.map((track) => track.id),
      )
    },
    {
      onMutate: ({ tracks }) => {
        // Optimistically update to the new value
        queryClient.setQueryData(
          ['playlistTracks', accessToken, LIKED_ID],
          (old: TrackItem[] | undefined) => {
            const newItems: TrackItem[] = tracks.map((track) => ({
              added_at: Date.toString(),
              added_by: {},
              is_local: false,
              primary_color: null,
              track,
              video_thumbnail: { url: null },
            }))
            return old ? [...old, ...newItems] : newItems
          },
        )
      },
    },
  )
}
