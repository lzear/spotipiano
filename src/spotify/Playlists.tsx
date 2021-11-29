import { useContext } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { PlaylistsItem } from '../store'
import { AuthedContext } from '../auth/AuthContext'
import { getPlaylists } from './reactQuery'

export const useAllPlaylists = (): UseQueryResult<PlaylistsItem[]> => {
  const { accessToken } = useContext(AuthedContext)
  return useQuery(['playlists', accessToken], getPlaylists, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
