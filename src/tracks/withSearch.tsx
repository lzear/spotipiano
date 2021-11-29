import { Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Tracks } from './Tracks'
import type { Track } from '../store'
import _ from 'lodash'

const useFilterTracks = <T,>({
  unfiltered,
  filter,
  filterable,
}: {
  unfiltered: T[] | null
  filter: string
  filterable: boolean
}) => {
  const [fff, sf] = useState(filter)
  const debounced = useRef(_.debounce((newValue: string) => sf(newValue), 1000))
  const [filtered, setFiltered] = useState(unfiltered)

  useEffect(() => debounced.current(filter), [filter])

  useEffect(() => {
    const filterList = async () => {
      if (!filterable || !unfiltered?.length || !fff.length) {
        setFiltered(unfiltered)
        return
      }
      const Fuse = (await import('fuse.js')).default
      const fuse = new Fuse(unfiltered, {
        keys: ['name', 'album.name', 'artists.name'],
      })
      const r = fuse.search(fff).map((r) => r.item)
      setFiltered(r)
    }
    void filterList()
  }, [fff, filterable, unfiltered])

  return filtered
}

const { Search } = Input
export const WithSearch = <T extends { tracks: Track[] | null }>(
  Comp: React.ComponentType<T & { total?: number }>,
) =>
  function Render(props: T): React.ReactElement {
    const [filter, setFilter] = useState('')

    const filtered = useFilterTracks({
      unfiltered: props.tracks,
      filter,
      filterable: true,
    })

    const length = filtered?.length
    return (
      <>
        <div className="search">
          <div className="input">
            <Search
              placeholder="Filter"
              onKeyPress={(a) => a.nativeEvent.stopPropagation()}
              onChange={(e) => setFilter(e.target.value)}
              onSearch={(e) => setFilter(e)}
              enterButton
            />
          </div>
          <div className="count">
            {!!length && `${length} element${length > 1 ? 's' : ''}`}
          </div>
        </div>
        <Comp {...props} tracks={filtered} total={props.tracks?.length} />
        <style jsx>{`
          .search {
            margin: 10px 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
          .input {
            flex: 1 1 auto;
          }
          .count {
            text-align: right;
            min-width: 112px;
            padding-left: 30px;
            flex: 0 0 auto;
          }
        `}</style>
      </>
    )
  }

export const TracksWithSearch = WithSearch(Tracks)
