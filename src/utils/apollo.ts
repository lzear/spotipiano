import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const client = new ApolloClient({
  link: ApolloLink.from([
    new HttpLink({
      uri: 'https://spotipiano.hasura.app/v1/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
})

export default client
