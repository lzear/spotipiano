import * as React from 'react'
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { Centered } from './utils/Centered'

export const Callback: NextPage = () => {
  const [okay, setOkay] = useState<boolean | null>(null)
  useEffect(() => {
    window.location.hash.split('&')[0].split('=')
    const queryParams: { access_token?: string } = window.location.hash
      .substring(1)
      .split('&')
      .reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        return { ...acc, [key]: value }
      }, {})

    if ('access_token' in queryParams && queryParams?.access_token) {
      const parent = window.opener || window.parent
      parent.postMessage(queryParams, window.location.origin)
      parent.postMessage({ close: true }, window.location.origin)
      setOkay(true)
      window.close()
    } else setOkay(false)
  }, [])

  const content =
    okay === false ? <div>uh uh</div> : <div>You&apos;re getting logged in</div>

  return <Centered>{content}</Centered>
}
