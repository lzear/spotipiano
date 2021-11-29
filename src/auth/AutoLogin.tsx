import { Layout, Spin } from 'antd'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { getLocal } from './AuthContext'
import { Centered } from './utils/Centered'
import { Login } from './Login'
import Link from 'next/link'
import { Me } from '../layout/HeaderDropdown'

const AuthIframe = dynamic(() => import('./AuthIframe'), {
  ssr: false,
})

const { Header } = Layout

export const AutoLogin: React.FC<{ sounds: string[] }> = ({ sounds }) => {
  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => {
    if (process.browser) {
      const timeout = setTimeout(() => setShowLogin(true), 3000)
      const rememberMeScope = getLocal()
      if (!rememberMeScope) setShowLogin(true)
      return () => clearTimeout(timeout)
    }
  }, [])
  return (
    <Layout id="layout">
      <Header id="header">
        <h1>
          <Link href="/">
            <a>
              <span className="white">spotipiano</span>
            </a>
          </Link>
        </h1>
        <Me />
      </Header>
      <Centered>
        <AuthIframe />
        {showLogin ? <Login sounds={sounds} /> : <Spin size="large" />}
      </Centered>

      <style jsx>{`
        h1 {
          margin-bottom: 0;
        }
        :global(#layout) {
          min-height: 100vh;
        }
        :global(#header) {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .white {
          color: white;
        }
      `}</style>
    </Layout>
  )
}
