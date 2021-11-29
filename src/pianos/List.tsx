import { ApolloQueryResult } from '@apollo/client'
import { Spin } from 'antd'
import Link from 'next/link'
import React from 'react'
import { PianosQuery } from '../generated/graphql'

export const PianoList: React.FC<{
  result: ApolloQueryResult<PianosQuery>
}> = ({ result }) => {
  const { data } = result
  if (!data?.spotipiano) {
    return <Spin />
  }
  if (data.spotipiano.length === 0) return <div>Empty</div>
  return (
    <>
      {data.spotipiano.map((spiano) => (
        <div key={spiano.id}>
          <Link href={`/s/${spiano.id}`}>
            <a>{spiano.title}</a>
          </Link>
        </div>
      ))}
    </>
  )
}
