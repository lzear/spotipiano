import { ApolloQueryResult } from '@apollo/client'
import { Button, Spin, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import Link from 'next/link'
import { PianoQuery } from '../generated/graphql'
import { SerializedKeys, SerializedSong } from '../partition/Save'
import { ZTrackContext } from '../tracks/ZTracks'
import {
  selectPartition,
  selectSetKeys,
  selectSetPartition,
} from '../store/selectors'
import { CurrentPianoTracks } from '../tracks/CurrentPianoTracks'
import DrumBox from '../sound-board/SoundBoard'
import AuthProvider from '../auth/AuthProvider'
import { PWith } from '../partition/usePlayPartition'
import { boundaries } from '../partition/Notes'
import { useStore } from '../store/zustand'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

type SpotiPiano = {
  title: string
  id: string
  song: SerializedSong | null
  piano: SerializedKeys | null
}
const { Title } = Typography

const getPiano = (sp: PianoQuery['spotipiano_by_pk']): SpotiPiano | null => {
  if (!sp) return null
  const piano = sp?.piano ? (sp?.piano as SerializedKeys) : null
  const song = sp?.piano ? (sp?.song as SerializedSong) : null
  return {
    ...sp,
    song,
    piano,
  }
}

export const Piano: React.FC<{
  spotiPiano: SpotiPiano
}> = ({ spotiPiano }) => {
  const setPartition = useStore(selectSetPartition)
  const partition = useStore(selectPartition)
  const setKeys = useStore(selectSetKeys)
  const [showTracks, setShowTracks] = useState(false)
  const { fetchTracks } = useContext(ZTrackContext)
  useEffect(() => {
    const ptids = spotiPiano.piano
      ? Object.values(spotiPiano.piano).map((v) => v.trackID)
      : []
    const stids = spotiPiano.song
      ? (spotiPiano.song
          .map((n) => !n.pause && n.trackID)
          .filter(Boolean) as string[])
      : []
    const trackIDs = _.uniq([...ptids, ...stids])
    fetchTracks(trackIDs)
    // if (spotiPiano.piano) setKeys(spotiPiano.piano)
    // if (spotiPiano.piano) setPartition(spotiPiano.song)
  }, [fetchTracks, spotiPiano.piano, spotiPiano.song])
  useEffect(() => {
    if (spotiPiano.piano) setKeys(spotiPiano.piano)
  }, [spotiPiano.piano, setKeys])
  useEffect(() => {
    if (spotiPiano.song) setPartition(spotiPiano.song)
  }, [spotiPiano.song, setPartition])

  return (
    <>
      <Title>{spotiPiano.title}</Title>

      {showTracks ? (
        <>
          <Button type="link" onClick={() => setShowTracks(false)}>
            Hide tracks <UpOutlined />
          </Button>
          <CurrentPianoTracks />
        </>
      ) : (
        <Button type="link" onClick={() => setShowTracks(true)}>
          Show tracks <DownOutlined />
        </Button>
      )}

      <DrumBox editable={false} />
      {partition.length && <PWith partition={boundaries(partition)} />}

      <div className="fork">
        <Link href="/?tab=current-piano">
          <a>
            <Button type="link">
              Open this soundboard and partition in editable mode
            </Button>
          </a>
        </Link>
      </div>
      <style jsx>{`
        .fork {
          margin-top: 50px;
          text-align: right;
        }
      `}</style>
    </>
  )
}

export const PianoContainer: React.FC<{
  result: ApolloQueryResult<PianoQuery>
  sounds: string[]
}> = ({ result, sounds }) => {
  const { data } = result
  const spotiPiano = data?.spotipiano_by_pk && getPiano(data.spotipiano_by_pk)
  return (
    <AuthProvider sounds={sounds}>
      {spotiPiano ? <Piano spotiPiano={spotiPiano} /> : <Spin />}
    </AuthProvider>
  )
}
