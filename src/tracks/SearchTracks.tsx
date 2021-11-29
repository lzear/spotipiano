import React, { useContext, useMemo, useState } from 'react'
import { Input } from 'antd'
import { useQuery } from 'react-query'
import _ from 'lodash'
import { useAddTracksToStore } from './TracksContext'
import { search } from '../spotify/reactQuery'
import { Tracks } from './Tracks'
import { AuthedContext } from '../auth/AuthContext'

const useDebouncedQuery = () => {
  const { accessToken } = useContext(AuthedContext)
  const [debounced, setDebounced] = useState('')

  const setFilter = useMemo(
    () =>
      _.debounce((v: string) => {
        setDebounced(v)
      }, 400),
    [],
  )

  const result = useQuery(['search', accessToken, debounced], search, {
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: debounced.length > 0,
  })
  useAddTracksToStore(result.data?.tracks.items || [])
  return {
    setFilter,
    result,
  }
}
const { Search } = Input
export const SearchTracks: React.FC = () => {
  const { setFilter, result } = useDebouncedQuery()
  const length = result.data?.tracks.items?.length
  return (
    <>
      <div className="search">
        <div className="input">
          <Search
            placeholder="Search"
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
      <Tracks
        tracks={result.data?.tracks.items || null}
        loading={result.isLoading}
        editable
      />
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
        .buttons {
          display: flex;
          justify-content: space-evenly;
        }
      `}</style>
    </>
  )
}
