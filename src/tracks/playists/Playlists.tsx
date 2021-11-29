import { Radio } from 'antd'
import * as React from 'react'
import { PlaylistsPicker, usePlaylistQueryParams } from './Picker'

export const Playlists: React.FC = () => {
  const [{ picklist }, setUrlParams] = usePlaylistQueryParams()

  return (
    <>
      <Radio.Group
        style={{ margin: '10px 0' }}
        onChange={(e) => setUrlParams({ picklist: e.target.value })}
        value={picklist}
      >
        <Radio value="single">Single</Radio>
        <Radio value="union">Union</Radio>
        <Radio value="intersection">Intersection</Radio>
      </Radio.Group>
      <PlaylistsPicker picklist={picklist} />
    </>
  )
}
