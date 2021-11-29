export type Owner = {
  display_name: string
  external_urls: { spotify: string }
  spotify: string
  href: string
  id: string
  type: string
  uri: string
}
export type PlaylistsItem = {
  collaborative: boolean
  description: string
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  primary_color: string | null
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: 'playlist'
  uri: string
}

export type Artist = {
  external_urls: { spotify: string }
  href: string
  id: string
  name: string
  type: 'artist'
  uri: string
}

export type Image = {
  height: number
  width: number
  url: string
}

export type Album = {
  album_type: 'album'
  artists: Artist[]
  available_markets: string[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: 'day'
  total_tracks: number
  type: 'album'
  uri: string
}

export type Track = {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  episode: boolean
  explicit: boolean
  external_ids: { isrc: string }
  external_urls: { spotify: string }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track: boolean
  track_number: number
  type: 'track'
  uri: string
}

export type TrackItem = {
  added_at: string
  // added_by: SpotifyUser
  is_local: boolean
  primary_color: string | null
  track: Track
  video_thumbnail: { url: string | null }
}

export type Page<Item> = {
  href: string
  items: Item[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export type Device = {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}

export enum Scope {
  UserReadPrivate = 'user-read-private',
  UserReadEmail = 'user-read-email',
  UserModifyPlaybackState = 'user-modify-playback-state',
  UserReadPlaybackState = 'user-read-playback-state',
  PlaylistReadPrivate = 'playlist-read-private',
  PlaylistModifyPublic = 'playlist-modify-public',
  PlaylistModifyPrivate = 'playlist-modify-private',
  UserLibraryRead = 'user-library-read',
  UserLibraryModify = 'user-library-modify',
}

export type Created = {
  collaborative: boolean
  description: string
  external_urls: { spotify: string }
  followers: { href: null; total: 0 }
  href: string
  id: string
  images: []
  name: string
  owner: Owner
  primary_color: string | null
  public: boolean
  snapshot_id: string
  tracks: { href: string; total: 0 }
  type: 'playlist'
  uri: string
}
