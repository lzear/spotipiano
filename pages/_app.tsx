import * as React from 'react'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import '../assets/antd-custom.less'
import 'antd/dist/antd.less'
import '../src/style.css'

import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { NEXT_PUBLIC_BASE_URL } from '../src/config'
import { NotificationsProvider } from '../src/utils/Notifications'
import apollo from '../src/utils/apollo'
import { ZTracks } from '../src/tracks/ZTracks'

const head = (
  <Head>
    <title>Spotipiano</title>
    <meta key="og:url" property="og:url" content={NEXT_PUBLIC_BASE_URL} />
    <meta key="og:title" property="og:title" content="Spotipiano" />
    <meta
      key="og:description"
      property="og:description"
      content="Soundbox using spotify"
    />
    <meta key="og:type" property="og:type" content="website" />
    <meta key="theme-color" property="theme-color" content="#2d6c6c" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
  </Head>
)

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const queryClientRef = React.useRef(new QueryClient())
  // if (!queryClientRef.current) queryClientRef.current = new QueryClient()
  return (
    <>
      {head}
      <Script
        async
        defer
        strategy="afterInteractive"
        data-domain="spotipiano.vercel.app"
        src="https://plausible.io/js/plausible.js"
      />
      <ApolloProvider client={apollo}>
        <QueryClientProvider client={queryClientRef.current}>
          <ZTracks>
            <Hydrate state={pageProps.dehydratedState}>
              <NotificationsProvider>
                <Component {...pageProps} />
              </NotificationsProvider>
            </Hydrate>
          </ZTracks>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
