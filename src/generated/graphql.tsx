import * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  jsonb: any
  timestamptz: any
  uuid: any
}

export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>
  _gt?: Maybe<Scalars['String']>
  _gte?: Maybe<Scalars['String']>
  _ilike?: Maybe<Scalars['String']>
  _in?: Maybe<Array<Scalars['String']>>
  _iregex?: Maybe<Scalars['String']>
  _is_null?: Maybe<Scalars['Boolean']>
  _like?: Maybe<Scalars['String']>
  _lt?: Maybe<Scalars['String']>
  _lte?: Maybe<Scalars['String']>
  _neq?: Maybe<Scalars['String']>
  _nilike?: Maybe<Scalars['String']>
  _nin?: Maybe<Array<Scalars['String']>>
  _niregex?: Maybe<Scalars['String']>
  _nlike?: Maybe<Scalars['String']>
  _nregex?: Maybe<Scalars['String']>
  _nsimilar?: Maybe<Scalars['String']>
  _regex?: Maybe<Scalars['String']>
  _similar?: Maybe<Scalars['String']>
}

export type Jsonb_Comparison_Exp = {
  _contained_in?: Maybe<Scalars['jsonb']>
  _contains?: Maybe<Scalars['jsonb']>
  _eq?: Maybe<Scalars['jsonb']>
  _gt?: Maybe<Scalars['jsonb']>
  _gte?: Maybe<Scalars['jsonb']>
  _has_key?: Maybe<Scalars['String']>
  _has_keys_all?: Maybe<Array<Scalars['String']>>
  _has_keys_any?: Maybe<Array<Scalars['String']>>
  _in?: Maybe<Array<Scalars['jsonb']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['jsonb']>
  _lte?: Maybe<Scalars['jsonb']>
  _neq?: Maybe<Scalars['jsonb']>
  _nin?: Maybe<Array<Scalars['jsonb']>>
}

export type Mutation_Root = {
  __typename?: 'mutation_root'
  delete_spotipiano?: Maybe<Spotipiano_Mutation_Response>
  delete_spotipiano_by_pk?: Maybe<Spotipiano>
  insert_spotipiano?: Maybe<Spotipiano_Mutation_Response>
  insert_spotipiano_one?: Maybe<Spotipiano>
  update_spotipiano?: Maybe<Spotipiano_Mutation_Response>
  update_spotipiano_by_pk?: Maybe<Spotipiano>
}

export type Mutation_RootDelete_SpotipianoArgs = {
  where: Spotipiano_Bool_Exp
}

export type Mutation_RootDelete_Spotipiano_By_PkArgs = {
  id: Scalars['uuid']
}

export type Mutation_RootInsert_SpotipianoArgs = {
  objects: Array<Spotipiano_Insert_Input>
  on_conflict?: Maybe<Spotipiano_On_Conflict>
}

export type Mutation_RootInsert_Spotipiano_OneArgs = {
  object: Spotipiano_Insert_Input
  on_conflict?: Maybe<Spotipiano_On_Conflict>
}

export type Mutation_RootUpdate_SpotipianoArgs = {
  _append?: Maybe<Spotipiano_Append_Input>
  _delete_at_path?: Maybe<Spotipiano_Delete_At_Path_Input>
  _delete_elem?: Maybe<Spotipiano_Delete_Elem_Input>
  _delete_key?: Maybe<Spotipiano_Delete_Key_Input>
  _prepend?: Maybe<Spotipiano_Prepend_Input>
  _set?: Maybe<Spotipiano_Set_Input>
  where: Spotipiano_Bool_Exp
}

export type Mutation_RootUpdate_Spotipiano_By_PkArgs = {
  _append?: Maybe<Spotipiano_Append_Input>
  _delete_at_path?: Maybe<Spotipiano_Delete_At_Path_Input>
  _delete_elem?: Maybe<Spotipiano_Delete_Elem_Input>
  _delete_key?: Maybe<Spotipiano_Delete_Key_Input>
  _prepend?: Maybe<Spotipiano_Prepend_Input>
  _set?: Maybe<Spotipiano_Set_Input>
  pk_columns: Spotipiano_Pk_Columns_Input
}

export enum Order_By {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last',
}

export type Query_Root = {
  __typename?: 'query_root'
  spotipiano: Array<Spotipiano>
  spotipiano_aggregate: Spotipiano_Aggregate
  spotipiano_by_pk?: Maybe<Spotipiano>
}

export type Query_RootSpotipianoArgs = {
  distinct_on?: Maybe<Array<Spotipiano_Select_Column>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  order_by?: Maybe<Array<Spotipiano_Order_By>>
  where?: Maybe<Spotipiano_Bool_Exp>
}

export type Query_RootSpotipiano_AggregateArgs = {
  distinct_on?: Maybe<Array<Spotipiano_Select_Column>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  order_by?: Maybe<Array<Spotipiano_Order_By>>
  where?: Maybe<Spotipiano_Bool_Exp>
}

export type Query_RootSpotipiano_By_PkArgs = {
  id: Scalars['uuid']
}

export type Spotipiano = {
  __typename?: 'spotipiano'
  created_at: Scalars['timestamptz']
  id: Scalars['uuid']
  piano: Scalars['jsonb']
  song?: Maybe<Scalars['jsonb']>
  title: Scalars['String']
}

export type SpotipianoPianoArgs = {
  path?: Maybe<Scalars['String']>
}

export type SpotipianoSongArgs = {
  path?: Maybe<Scalars['String']>
}

export type Spotipiano_Aggregate = {
  __typename?: 'spotipiano_aggregate'
  aggregate?: Maybe<Spotipiano_Aggregate_Fields>
  nodes: Array<Spotipiano>
}

export type Spotipiano_Aggregate_Fields = {
  __typename?: 'spotipiano_aggregate_fields'
  count: Scalars['Int']
  max?: Maybe<Spotipiano_Max_Fields>
  min?: Maybe<Spotipiano_Min_Fields>
}

export type Spotipiano_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Spotipiano_Select_Column>>
  distinct?: Maybe<Scalars['Boolean']>
}

export type Spotipiano_Append_Input = {
  piano?: Maybe<Scalars['jsonb']>
  song?: Maybe<Scalars['jsonb']>
}

export type Spotipiano_Bool_Exp = {
  _and?: Maybe<Array<Spotipiano_Bool_Exp>>
  _not?: Maybe<Spotipiano_Bool_Exp>
  _or?: Maybe<Array<Spotipiano_Bool_Exp>>
  created_at?: Maybe<Timestamptz_Comparison_Exp>
  id?: Maybe<Uuid_Comparison_Exp>
  piano?: Maybe<Jsonb_Comparison_Exp>
  song?: Maybe<Jsonb_Comparison_Exp>
  title?: Maybe<String_Comparison_Exp>
}

export enum Spotipiano_Constraint {
  SpotipianoPkey = 'spotipiano_pkey',
}

export type Spotipiano_Delete_At_Path_Input = {
  piano?: Maybe<Array<Scalars['String']>>
  song?: Maybe<Array<Scalars['String']>>
}

export type Spotipiano_Delete_Elem_Input = {
  piano?: Maybe<Scalars['Int']>
  song?: Maybe<Scalars['Int']>
}

export type Spotipiano_Delete_Key_Input = {
  piano?: Maybe<Scalars['String']>
  song?: Maybe<Scalars['String']>
}

export type Spotipiano_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  piano?: Maybe<Scalars['jsonb']>
  song?: Maybe<Scalars['jsonb']>
  title?: Maybe<Scalars['String']>
}

export type Spotipiano_Max_Fields = {
  __typename?: 'spotipiano_max_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  title?: Maybe<Scalars['String']>
}

export type Spotipiano_Min_Fields = {
  __typename?: 'spotipiano_min_fields'
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  title?: Maybe<Scalars['String']>
}

export type Spotipiano_Mutation_Response = {
  __typename?: 'spotipiano_mutation_response'
  affected_rows: Scalars['Int']
  returning: Array<Spotipiano>
}

export type Spotipiano_On_Conflict = {
  constraint: Spotipiano_Constraint
  update_columns?: Array<Spotipiano_Update_Column>
  where?: Maybe<Spotipiano_Bool_Exp>
}

export type Spotipiano_Order_By = {
  created_at?: Maybe<Order_By>
  id?: Maybe<Order_By>
  piano?: Maybe<Order_By>
  song?: Maybe<Order_By>
  title?: Maybe<Order_By>
}

export type Spotipiano_Pk_Columns_Input = {
  id: Scalars['uuid']
}

export type Spotipiano_Prepend_Input = {
  piano?: Maybe<Scalars['jsonb']>
  song?: Maybe<Scalars['jsonb']>
}

export enum Spotipiano_Select_Column {
  CreatedAt = 'created_at',
  Id = 'id',
  Piano = 'piano',
  Song = 'song',
  Title = 'title',
}

export type Spotipiano_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  piano?: Maybe<Scalars['jsonb']>
  song?: Maybe<Scalars['jsonb']>
  title?: Maybe<Scalars['String']>
}

export enum Spotipiano_Update_Column {
  CreatedAt = 'created_at',
  Id = 'id',
  Piano = 'piano',
  Song = 'song',
  Title = 'title',
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  spotipiano: Array<Spotipiano>
  spotipiano_aggregate: Spotipiano_Aggregate
  spotipiano_by_pk?: Maybe<Spotipiano>
}

export type Subscription_RootSpotipianoArgs = {
  distinct_on?: Maybe<Array<Spotipiano_Select_Column>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  order_by?: Maybe<Array<Spotipiano_Order_By>>
  where?: Maybe<Spotipiano_Bool_Exp>
}

export type Subscription_RootSpotipiano_AggregateArgs = {
  distinct_on?: Maybe<Array<Spotipiano_Select_Column>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  order_by?: Maybe<Array<Spotipiano_Order_By>>
  where?: Maybe<Spotipiano_Bool_Exp>
}

export type Subscription_RootSpotipiano_By_PkArgs = {
  id: Scalars['uuid']
}

export type Timestamptz_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamptz']>
  _gt?: Maybe<Scalars['timestamptz']>
  _gte?: Maybe<Scalars['timestamptz']>
  _in?: Maybe<Array<Scalars['timestamptz']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['timestamptz']>
  _lte?: Maybe<Scalars['timestamptz']>
  _neq?: Maybe<Scalars['timestamptz']>
  _nin?: Maybe<Array<Scalars['timestamptz']>>
}

export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>
  _gt?: Maybe<Scalars['uuid']>
  _gte?: Maybe<Scalars['uuid']>
  _in?: Maybe<Array<Scalars['uuid']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['uuid']>
  _lte?: Maybe<Scalars['uuid']>
  _neq?: Maybe<Scalars['uuid']>
  _nin?: Maybe<Array<Scalars['uuid']>>
}

export type CreatePianoMutationVariables = Exact<{
  title: Scalars['String']
  piano: Scalars['jsonb']
  song?: Maybe<Scalars['jsonb']>
}>

export type CreatePianoMutation = {
  __typename?: 'mutation_root'
  insert_spotipiano_one?: Maybe<{
    __typename?: 'spotipiano'
    created_at: any
    id: any
    piano: any
    song?: Maybe<any>
    title: string
  }>
}

export type PianoQueryVariables = Exact<{
  id: Scalars['uuid']
}>

export type PianoQuery = {
  __typename?: 'query_root'
  spotipiano_by_pk?: Maybe<{
    __typename?: 'spotipiano'
    created_at: any
    id: any
    piano: any
    song?: Maybe<any>
    title: string
  }>
}

export type PianosQueryVariables = Exact<{
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
}>

export type PianosQuery = {
  __typename?: 'query_root'
  spotipiano: Array<{
    __typename?: 'spotipiano'
    created_at: any
    id: any
    piano: any
    song?: Maybe<any>
    title: string
  }>
}

export const CreatePianoDocument = gql`
  mutation createPiano($title: String!, $piano: jsonb!, $song: jsonb) {
    insert_spotipiano_one(
      object: { piano: $piano, song: $song, title: $title }
    ) {
      created_at
      id
      piano
      song
      title
    }
  }
`
export type CreatePianoMutationFn = Apollo.MutationFunction<
  CreatePianoMutation,
  CreatePianoMutationVariables
>

/**
 * __useCreatePianoMutation__
 *
 * To run a mutation, you first call `useCreatePianoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePianoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPianoMutation, { data, loading, error }] = useCreatePianoMutation({
 *   variables: {
 *      title: // value for 'title'
 *      piano: // value for 'piano'
 *      song: // value for 'song'
 *   },
 * });
 */
export function useCreatePianoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePianoMutation,
    CreatePianoMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePianoMutation, CreatePianoMutationVariables>(
    CreatePianoDocument,
    options,
  )
}
export type CreatePianoMutationHookResult = ReturnType<
  typeof useCreatePianoMutation
>
export type CreatePianoMutationResult =
  Apollo.MutationResult<CreatePianoMutation>
export type CreatePianoMutationOptions = Apollo.BaseMutationOptions<
  CreatePianoMutation,
  CreatePianoMutationVariables
>
export const PianoDocument = gql`
  query piano($id: uuid!) {
    spotipiano_by_pk(id: $id) {
      created_at
      id
      piano
      song
      title
    }
  }
`

/**
 * __usePianoQuery__
 *
 * To run a query within a React component, call `usePianoQuery` and pass it any options that fit your needs.
 * When your component renders, `usePianoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePianoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePianoQuery(
  baseOptions: Apollo.QueryHookOptions<PianoQuery, PianoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PianoQuery, PianoQueryVariables>(
    PianoDocument,
    options,
  )
}
export function usePianoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PianoQuery, PianoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PianoQuery, PianoQueryVariables>(
    PianoDocument,
    options,
  )
}
export type PianoQueryHookResult = ReturnType<typeof usePianoQuery>
export type PianoLazyQueryHookResult = ReturnType<typeof usePianoLazyQuery>
export type PianoQueryResult = Apollo.QueryResult<
  PianoQuery,
  PianoQueryVariables
>
export const PianosDocument = gql`
  query pianos($offset: Int, $limit: Int) {
    spotipiano(limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      created_at
      id
      piano
      song
      title
    }
  }
`

/**
 * __usePianosQuery__
 *
 * To run a query within a React component, call `usePianosQuery` and pass it any options that fit your needs.
 * When your component renders, `usePianosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePianosQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function usePianosQuery(
  baseOptions?: Apollo.QueryHookOptions<PianosQuery, PianosQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PianosQuery, PianosQueryVariables>(
    PianosDocument,
    options,
  )
}
export function usePianosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PianosQuery, PianosQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PianosQuery, PianosQueryVariables>(
    PianosDocument,
    options,
  )
}
export type PianosQueryHookResult = ReturnType<typeof usePianosQuery>
export type PianosLazyQueryHookResult = ReturnType<typeof usePianosLazyQuery>
export type PianosQueryResult = Apollo.QueryResult<
  PianosQuery,
  PianosQueryVariables
>
