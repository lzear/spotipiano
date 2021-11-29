import { GetServerSideProps, NextPage } from 'next'
import { ApolloQueryResult } from '@apollo/client'
import apollo from '../../src/utils/apollo'
import { PianosDocument, PianosQuery } from '../../src/generated/graphql'
import { PianoList } from '../../src/pianos/List'

export const getServerSideProps: GetServerSideProps = async () => {
  const result = await apollo.query<PianosQuery>({
    query: PianosDocument,
  })
  return { props: { result } }
}

const C: NextPage<{ result: ApolloQueryResult<PianosQuery> }> = PianoList

export default C
