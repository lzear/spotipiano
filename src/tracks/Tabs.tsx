import { Radio } from 'antd'
import * as React from 'react'
import { useQueryParams } from '../utils/useQueryParams'
import { CurrentPianoTracks } from './CurrentPianoTracks'
import { SearchTracks } from './SearchTracks'
import { useStore } from '../store/zustand'
import { PlaylistsTracks } from './playists/PlaylistsTracks'
import { Playlists } from './playists/Playlists'

export enum Tab {
  CurrentPiano = 'current-piano',
  Playlist = 'playlists',
  Search = 'search',
}

export const useTabs = (): [Tab, (tab: Tab) => void] => {
  const [urlParams, setUrlParams] = useQueryParams<{ tab: Tab }>()
  const tab = urlParams.tab || Tab.Playlist
  const setTab = (newTab: Tab) => setUrlParams({ tab: newTab })
  return [tab, setTab]
}

export const Tabs: React.FC = () => {
  const [tab, setTab] = useTabs()
  let content = null
  const hasPiano = useStore((s) => Object.keys(s.soundBoard.keys).length > 0)
  if (tab === Tab.Playlist)
    content = (
      <>
        <Playlists />
        <PlaylistsTracks />
      </>
    )
  if (tab === Tab.CurrentPiano) content = <CurrentPianoTracks editable />
  if (tab === Tab.Search) content = <SearchTracks />
  return (
    <>
      <div>
        <Radio.Group value={tab} onChange={(e) => setTab(e.target.value)}>
          <Radio.Button className="radiotab" value={Tab.Playlist}>
            Playlists
          </Radio.Button>
          <Radio.Button className="radiotab" value={Tab.Search}>
            Search
          </Radio.Button>
          {hasPiano && (
            <Radio.Button className="radiotab" value={Tab.CurrentPiano}>
              Current Piano
            </Radio.Button>
          )}
        </Radio.Group>
      </div>
      {content}
      <style jsx>{`
        div {
          margin: 0 -5px;
        }
        :global(.radiotab) {
          margin: 0 5px;
        }
      `}</style>
    </>
  )
}
