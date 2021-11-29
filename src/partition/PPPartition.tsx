import * as React from 'react'
import { Record } from './Record'
import { selectPartition } from '../store/selectors'
import { PartitionEditor } from './PartitionEditor'
import { Store, useStore } from '../store/zustand'
import { Typography } from 'antd'

const selectHasKeys = (s: Store) => Object.keys(s.soundBoard.keys).length > 1

const { Title } = Typography
export const PPPartition: React.FC = () => {
  const partition = useStore(selectPartition)
  const hasKeys = useStore(selectHasKeys)

  return (
    <>
      {hasKeys && (
        <Title style={{ marginTop: 50 }} level={2}>
          3. Record a partition
        </Title>
      )}
      {partition.length ? (
        <PartitionEditor partition={partition} />
      ) : (
        <Record />
      )}
    </>
  )
}
