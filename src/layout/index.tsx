import { Layout } from 'antd'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { Me } from './HeaderDropdown'

const { Header, Content } = Layout

const Foot = dynamic(() => import('./Foot'), {
  ssr: false,
})

export const MyLayout: React.FC = ({ children }) => {
  return (
    <Layout id="layout">
      <div id="scroll" className="scroll">
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
        <Content id="content">{children}</Content>
      </div>
      <Foot />
      <style jsx>{`
        h1 {
          margin-bottom: 0;
        }
        :global(#layout) {
          height: 100vh;
          display: absolute;
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
        }
        .scroll {
          flex: 1 1 auto;
          overflow: scroll;
        }
        :global(#header) {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        :global(#content) {
          padding: 20px;
          overflow-x: hidden;
          flex: 1 1 auto;
        }
        .white {
          color: white;
        }
      `}</style>
    </Layout>
  )
}
