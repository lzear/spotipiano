/* eslint-disable */
import { QueryKey, useQueries, UseQueryOptions, UseQueryResult } from "react-query";

export function useQueriesTyped<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queries: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[],
): UseQueryResult<TData, TError>[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useQueries(queries) as any
}
