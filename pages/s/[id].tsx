import { GetServerSideProps, NextPage } from 'next'
import { ApolloQueryResult } from '@apollo/client'
import apollo from '../../src/utils/apollo'
import { PianoDocument, PianoQuery } from '../../src/generated/graphql'
import { PianoContainer } from '../../src/pianos/Piano'
import path from 'path'
import fs from 'fs'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const dir = path.resolve('./public/sounds')
  const sounds = fs.readdirSync(dir)
  const { id } = query
  if (id) {
    const result = await apollo.query<PianoQuery>({
      query: PianoDocument,
      variables: { id },
    })

    return { props: { result, sounds } }
  }
  throw new Error('need ID!')
}

const Page: NextPage<{
  result: ApolloQueryResult<PianoQuery>
  sounds: string[]
}> = PianoContainer

export default Page
