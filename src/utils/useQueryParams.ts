import { useRouter } from 'next/router'

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export const useQueryParams = <
  Params extends Record<string, string>,
>(): readonly [Params, (params: Nullable<Partial<Params>>) => void] => {
  const router = useRouter()
  const query = router.query as Params

  const urlSearchParams = new URLSearchParams(query)
  const setParams = (params: Nullable<Partial<Params>>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') urlSearchParams.delete(key)
      else if (value !== undefined) urlSearchParams.set(key, value)
    })

    void router.replace(
      `${router.asPath.split('?')[0]}?${urlSearchParams.toString()}`,
      undefined,
      { shallow: true },
    )
  }
  return [query, setParams] as const
}
