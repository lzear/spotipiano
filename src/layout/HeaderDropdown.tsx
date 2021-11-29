import {
  ContactsOutlined,
  DownOutlined,
  GithubOutlined,
  LogoutOutlined,
  RedoOutlined,
  SoundOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { QueryFunctionContext, useQuery } from 'react-query'
import shallow from 'zustand/shallow'
import { removeLocal } from '../auth/AuthContext'
import { SpotifyQuerier } from '../spotify/SpotifyQuerier'
import { useStore } from '../store/zustand'
import { DeviceMenuItem, useDevice } from '../devices/DeviceSelector'
import { RefreshNeededIn } from '../auth/RefreshNeededIn'
import { selectSetNoAutoDevice } from '../store/selectors'

const getMe = async (
  context: QueryFunctionContext<[key: string, accessToken: string]>,
) => {
  const [, accessToken] = context.queryKey
  return SpotifyQuerier.me(accessToken)
}

export const Me: React.FC = () => {
  const [auth, setAuth] = useStore(
    (state) => [state.auth, state.setAuth],
    shallow,
  )
  const { data } = useQuery(['me', auth?.accessToken ?? ''], getMe, {
    enabled: !!auth?.accessToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [iframe, setIframe] = useState(false)
  const { device, loading } = useDevice()

  useEffect(() => setIframe(false), [auth?.accessToken])

  const setNoAutoDevice = useStore(selectSetNoAutoDevice)
  return data ? (
    <>
      <div ref={containerRef} />
      <Dropdown
        visible={visible}
        onVisibleChange={setVisible}
        destroyPopupOnHide
        getPopupContainer={() => containerRef.current || window.document.body}
        overlay={
          <Menu>
            <Menu.Item
              icon={<RedoOutlined />}
              onClick={() => setIframe(true)}
              key={0}
              tabIndex={0}
            >
              <RefreshNeededIn
                key={0}
                close={() => setVisible(false)}
                iframe={iframe}
              />
            </Menu.Item>
            <Menu.Item
              icon={<SoundOutlined />}
              key={1}
              onClick={device && setNoAutoDevice}
              danger={!loading && !device}
            >
              <DeviceMenuItem
                key={1}
                close={() => setVisible(false)}
                device={device}
                loading={loading}
              />
            </Menu.Item>
            <Menu.Item icon={<GithubOutlined />} key={2}>
              <a
                tabIndex={0}
                href="https://github.com/lzear/spotipiano"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </Menu.Item>
            <Menu.Item icon={<ContactsOutlined />} key={3}>
              <a
                tabIndex={0}
                href="https://www.elzear.de"
                target="_blank"
                rel="noopener noreferrer"
              >
                Author
              </a>
            </Menu.Item>
            <Menu.Item
              key={4}
              tabIndex={0}
              onClick={() => {
                removeLocal()
                setAuth(null)
              }}
              icon={<LogoutOutlined />}
            >
              Log out
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <Button
          className="trigger"
          type="link"
          role="listbox"
          // onClick={() => setvisible(!visible)}
          // onKeyPress={() => setvisible(!visible)}
          tabIndex={0}
        >
          {data.display_name} <DownOutlined />
        </Button>
      </Dropdown>
      <style jsx>{`
        :global(.trigger):focus {
          // outline: solid 1px red;
          outline: inherit;
        }
        :global(.trigger) {
          // outline: solid 1px red;
          outline: inherit;
        }
      `}</style>
    </>
  ) : (
    <a
      tabIndex={0}
      href="https://github.com/lzear/spotipiano"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubOutlined />

      <style jsx>{`
        a {
          display: flex;
        }
      `}</style>
    </a>
  )
}
