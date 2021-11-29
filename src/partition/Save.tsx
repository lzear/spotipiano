import { Alert, Button, Form, Input, Typography } from 'antd'
import React, { useState } from 'react'
import _ from 'lodash'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Pianote, PianotePause, TrackMoment } from '../utils/notes'
import { useCreatePianoMutation } from '../generated/graphql'
import {
  selectDrumboxKeys,
  selectPartition,
  selectSetPartition,
} from '../store/selectors'
import { useRouter } from 'next/router'
import { useStore } from '../store/zustand'

export type SerializedKeys = {
  [letter: string]: { positionMs: number; trackID: string }
}

export type SerializedSong = (
  | {
      id: string
      at: number
      positionMs: number
      trackID: string
      pause: false
    }
  | {
      id: string
      at: number
      pause: true
    }
)[]

const serializeKeys = (keys: {
  [letter: string]: TrackMoment | null
}): SerializedKeys =>
  _.mapValues(
    _.pickBy(keys, Boolean) as { [letter: string]: TrackMoment },
    (v) => ({
      positionMs: v.positionMs,
      trackID: v.trackID,
    }),
  )

const serializeSong = (partion: (Pianote | PianotePause)[]): SerializedSong =>
  partion.map((n) => n)

const { Title } = Typography

export const Save: React.FC = () => {
  const [createPianoMutation, { loading, error }] = useCreatePianoMutation()

  const [isNavigating, setIsNavigating] = useState(false)
  const [title, setTitle] = useState('')
  const keys = useStore(selectDrumboxKeys)

  const setPartition = useStore(selectSetPartition)
  const partition = useStore(selectPartition)

  const router = useRouter()
  if (partition.length === 0) return null
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Form
      onKeyPress={(e) => e.stopPropagation()}
      layout="horizontal"
      style={{ maxWidth: 600 }}
    >
      <Title level={2} style={{ marginTop: 50 }}>
        4. Save
      </Title>

      {error && (
        <Alert
          message="An error occurred"
          description={error?.message}
          type="error"
          style={{ marginBottom: 20 }}
        />
      )}
      <Form.Item label="Title">
        <Input onChange={(e) => setTitle(e.target.value)} />
      </Form.Item>

      <Form.Item>
        <Button onClick={() => setPartition([])} icon={<DeleteOutlined />}>
          Delete
        </Button>
        <Button
          loading={loading || isNavigating}
          type="primary"
          style={{ marginLeft: 10 }}
          disabled={!title.length}
          onClick={async () => {
            const r = await createPianoMutation({
              variables: {
                piano: keys ? serializeKeys(keys) : null,
                song: partition ? serializeSong(partition) : null,
                title,
              },
            })
            setIsNavigating(true)
            if (r.data?.insert_spotipiano_one)
              void router.push(`/s/${r.data.insert_spotipiano_one.id}`)
          }}
          icon={<SaveOutlined />}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}
