import { QueryFunctionContext } from 'react-query'
import { Device, Page, Track } from '../store'
import { CurrentlyPlaying } from './ApiTypes'

export const URL_PREFIX = 'https://api.spotify.com/v1'

type FetchInput = {
  accessToken: string
  body?: string
  href: string
  method?: 'post' | 'put' | 'delete' | undefined
  silence?: boolean
}

type SpotifyResponseError = {
  error: {
    message: string
    reason: string
    status: number
  }
}

export class SpotifyQuerier {
  private static fetchJson = async <T>(input: FetchInput) => {
    try {
      const r = await SpotifyQuerier.fetch(input)

      const rJ = await r.json()

      if (rJ.error) throw rJ.error?.message

      return rJ as T
    } catch (e) {
      console.error('Error fetching ', input)
      throw e
    }
  }

  private static fetchJsonCanNull = async <T>(input: FetchInput) => {
    const r = await SpotifyQuerier.fetch(input)

    if (r.status === 204) return null

    const rJ = await r.json()

    if (rJ.error) throw rJ.error?.message

    return rJ as T
  }

  private static fetch = async ({
    accessToken,
    href,
    body,
    method,
  }: FetchInput) =>
    fetch(href, {
      method,
      body,
      headers: { Authorization: `Bearer ${accessToken}` },
    })

  public static accumulate = async <Item>(
    accessToken: string,
    href: string,
    cb?: (offset: number, total: number | null) => void,
  ): Promise<Item[]> => {
    const items: Item[] = []

    let next: string | null = href

    cb?.(0, null)
    do {
      // eslint-disable-next-line no-await-in-loop
      const page: Page<Item> = await SpotifyQuerier.fetchJson<Page<Item>>({
        accessToken,
        href: next,
      })
      next = page.next
      items.push(...page.items)
      cb?.(Math.min(page.total, page.offset + 50), page.total)
    } while (next)

    return items
  }

  public static getTracks = async (accessToken: string, ids: string[]) => {
    const r = await SpotifyQuerier.fetchJson<{ tracks: Track[] }>({
      accessToken,
      href: `${URL_PREFIX}/tracks?${new URLSearchParams({
        ids: ids.join(','),
      })}`,
    })
    return r.tracks
  }

  public static addToSaved = async (
    accessToken: string | null,
    trackIDs: string[],
  ) =>
    accessToken
      ? SpotifyQuerier.fetch({
          method: 'put',
          accessToken,
          href: `${URL_PREFIX}/me/tracks`,
          body: JSON.stringify({
            ids: trackIDs.map((id) => `${id}`),
          }),
        })
      : null

  public static devices = (
    accessToken: string,
  ): Promise<{
    devices: Device[]
  }> =>
    SpotifyQuerier.fetchJson<{
      devices: Device[]
    }>({
      href: `${URL_PREFIX}/me/player/devices`,
      accessToken,
    })

  /*
  {
    "timestamp": 0,
    "context": null,
    "progress_ms": 0,
    "item": null,
    "currently_playing_type": "unknown",
    "actions": {
        "disallows": {
            "pausing": true,
            "resuming": true,
            "seeking": true,
            "skipping_prev": true,
            "skipping_next": true
        }
    },
    "is_playing": false
}
   */

  public static currentPlayer = async (
    accessToken: string,
  ): Promise<{
    progress_ms: number
    item: Track
  } | null> =>
    SpotifyQuerier.fetchJsonCanNull<{
      progress_ms: number
      item: Track
    }>({
      accessToken,
      href: `${URL_PREFIX}/me/player`,
    })

  public static search = async (
    accessToken: string,
    q: string,
  ): Promise<{ tracks: Page<Track> }> =>
    SpotifyQuerier.fetchJson<{ tracks: Page<Track> }>({
      accessToken,
      href: `${URL_PREFIX}/search?${new URLSearchParams({
        q,
        type: 'track',
      })}`,
    })

  public static currentlyPlaying = async (
    accessToken: string,
  ): Promise<CurrentlyPlaying | null> =>
    SpotifyQuerier.fetchJsonCanNull<CurrentlyPlaying>({
      accessToken,
      href: `${URL_PREFIX}/me/player/currently-playing`,
    })

  public static me = async (accessToken: string) =>
    SpotifyQuerier.fetchJson<{ display_name: string }>({
      accessToken,
      href: `${URL_PREFIX}/me`,
    })

  public static pause = async (accessToken: string): Promise<Response> =>
    SpotifyQuerier.fetch({
      method: 'put',
      accessToken,
      href: `${URL_PREFIX}/me/player/pause`,
      silence: true,
    })

  public static play = async (
    accessToken: string,
    body: { uris?: string[]; position_ms: number },
    deviceID?: string,
  ): Promise<void | { error: { message: string } }> => {
    const suffix = deviceID ? `device_id=${deviceID}` : ''
    const r = await SpotifyQuerier.fetch({
      method: 'put',
      accessToken,
      href: `${URL_PREFIX}/me/player/play?${suffix}`,
      body: JSON.stringify(body),
      silence: true,
    })
    if (!r.ok) {
      let message
      try {
        message = (await r.json()).error?.message
      } catch (e) {
        console.error(e)
      }
      if (message) throw Error(message)
    }

    if (r.status < 300) return undefined
    const a: SpotifyResponseError | null = await r.json()

    if (
      a &&
      'error' in a &&
      a?.error?.reason === 'NO_ACTIVE_DEVICE' &&
      !deviceID
    )
      throw Error('NO_ACTIVE_DEVICE')
    throw Error('Unknow error')
  }
}

export const getDevices = async (
  context: QueryFunctionContext<[key: string, accessToken: string]>,
) => {
  const [, accessToken] = context.queryKey
  return SpotifyQuerier.devices(accessToken)
}
