import { Spin, Tag } from 'antd'
import * as React from 'react'
import { Nullable, useQueryParams } from '../../utils/useQueryParams'
import { PlaylistsItem } from '../../store'
import { useAllPlaylists } from '../../spotify/Playlists'
import { Store, useStore } from '../../store/zustand'

export const LIKED_ID = 'liked'

type PlaylistQueryParams = {
  idsIn: string[]
  idsOut: string[]
  picklist: 'single' | 'union' | 'intersection'
}

export const usePlaylistQueryParams = (): readonly [
  PlaylistQueryParams,
  (p: Partial<PlaylistQueryParams>) => void,
] => {
  type UrlParam = {
    in: string
    out: string
    picklist: 'single' | 'union' | 'intersection'
  }
  const [urlParams, setUrlParams] = useQueryParams<UrlParam>()

  const params: PlaylistQueryParams = {
    idsIn: urlParams.in?.split('-') ?? [],
    idsOut: urlParams.out?.split('-') ?? [],
    picklist: urlParams.picklist || 'single',
  }
  const setParams = (p: Partial<PlaylistQueryParams>) => {
    const v: Partial<Nullable<UrlParam>> = {}
    if (p.idsIn) v.in = p.idsIn.length ? p.idsIn.join('-') : null
    if (p.idsOut) v.out = p.idsOut.length ? p.idsOut.join('-') : null
    if (p.picklist === 'union' || p.picklist === 'intersection')
      v.picklist = p.picklist
    else if (p.picklist) v.picklist = null
    setUrlParams(v)
  }
  return [params, setParams] as const
}

const colorFromPicked = (onOff: boolean | null | undefined) => {
  if (onOff === true)
    return {
      checked: 'true',
      color: 'green',
    } as const
  if (onOff === false)
    return {
      checked: 'false',
      color: 'red',
    } as const
  return {
    checked: 'mixed',
    color: 'gray',
  } as const
}

export const PlaylistListItem: React.FC<{
  playlist: PlaylistsItem
  onChange: () => void
  onOff?: boolean | null
}> = ({ playlist, onChange, onOff }) => {
  const { color, checked } = colorFromPicked(onOff)
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      tabIndex={0}
      onKeyPress={(e) => {
        if (['Enter'].includes(e.key)) onChange()
      }}
    >
      <Tag style={{ cursor: 'pointer', margin: 2 }} color={color}>
        {playlist.name} ({playlist.tracks.total})
      </Tag>
    </div>
  )
}

const usePlaylistPicknMixer = () => {
  const [{ idsIn, idsOut }, setUrlParams] = usePlaylistQueryParams()
  const onOff = (id: string) =>
    idsIn.includes(id) || (idsOut.includes(id) ? false : null)

  const onChange = (id: string) => {
    if (idsIn.includes(id))
      setUrlParams({
        idsIn: idsIn.filter((pid) => pid !== id),
        idsOut: [...idsOut, id],
      })
    else if (idsOut.includes(id))
      setUrlParams({ idsIn, idsOut: idsOut.filter((pid) => pid !== id) })
    else setUrlParams({ idsIn: [...idsIn, id], idsOut })
  }
  return { onOff, onChange, idsIn, idsOut }
}

const usePlaylistPickerPick = () => {
  const [{ idsIn, idsOut }, setUrlParams] = usePlaylistQueryParams()
  const onOff = (id: string) =>
    idsIn.includes(id) || (idsOut.includes(id) ? false : null)
  const onChange = (id: string) => setUrlParams({ idsIn: [id], idsOut: [] })
  return { onOff, onChange, idsIn, idsOut }
}

const usePlaylistPicker = (picklist: 'single' | 'union' | 'intersection') =>
  (picklist === 'single' ? usePlaylistPickerPick : usePlaylistPicknMixer)()

export const selectLikedLength = (s: Store) =>
  s.playlistsLoading[LIKED_ID]?.total

const LikedTag: React.FC<{
  onChange: (id: string) => void
  onOff: boolean | null
}> = ({ onChange, onOff }) => {
  const count = useStore(selectLikedLength)

  const liked = colorFromPicked(onOff)
  return (
    <div
      role="checkbox"
      aria-checked={liked.checked}
      onClick={() => onChange(LIKED_ID)}
      tabIndex={0}
      onKeyPress={(e) => {
        if (['Enter'].includes(e.key)) onChange(LIKED_ID)
      }}
    >
      <Tag style={{ cursor: 'pointer', margin: 2 }} color={liked.color}>
        <span role="img" aria-label="heart">
          ❤️
        </span>{' '}
        Liked tracks{count && ` (${count})`}
      </Tag>
    </div>
  )
}

export const PlaylistsPicker: React.FC<{
  picklist: 'single' | 'union' | 'intersection'
}> = ({ picklist }) => {
  const { data: allPlaylists } = useAllPlaylists()
  const { onOff, onChange } = usePlaylistPicker(picklist)
  if (!allPlaylists) return <Spin />
  return (
    <div className="container">
      <LikedTag onOff={onOff(LIKED_ID)} onChange={onChange} />
      {allPlaylists.map((pplaylist) => (
        <PlaylistListItem
          key={pplaylist.id}
          playlist={pplaylist}
          onOff={onOff(pplaylist.id)}
          onChange={() => onChange(pplaylist.id)}
        />
      ))}
      <style jsx>{`
        .container {
          margin: -2px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
