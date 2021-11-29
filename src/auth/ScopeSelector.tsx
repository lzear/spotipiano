import { Alert, Button, Checkbox, Divider, Form } from 'antd'
import _ from 'lodash'
import React, { useContext, useState } from 'react'
import { AuthContext, saveLocal, spotifyAuthParams } from './AuthContext'
import { Scope } from '../store'
import rString from '../utils/rString'
import Spotify from './spotify.svg'

enum Mode {
  SeePrivateLists = 'see-private-playlists',
  SaveTracks = 'save-tracks',
}

const requiredScopes = [
  Scope.UserModifyPlaybackState,
  Scope.UserReadPlaybackState,
]

const extraModesDef: Record<Mode, { description: string; scopes: Scope[] }> = {
  [Mode.SeePrivateLists]: {
    description: 'See your private playlists',
    scopes: [Scope.PlaylistReadPrivate, Scope.UserLibraryRead],
  },
  [Mode.SaveTracks]: {
    description: 'Manage your saved content',
    scopes: [Scope.UserLibraryModify],
  },
}

const ScopeSelector: React.FC = () => {
  const { setPreAuthState } = useContext(AuthContext)
  const [extraModes, setExtraModes] = useState<Mode[]>([])
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <>
      <h2>
        <span className="img">
          <Spotify />
        </span>
        Sign in to Spotify premium to use your preferred songs 🎶
      </h2>

      <Alert
        style={{ maxWidth: 450, marginBottom: 20 }}
        message="Unfortunately, Spotify does not provide all the functionalities needed in Spotipiano to non-premium accounts 🙁"
        type="info"
      />
      <Form layout="vertical">
        <Form.Item label="Additional permissions">
          <Checkbox.Group
            options={[
              {
                label: 'See your private playlists',
                value: Mode.SeePrivateLists,
              },
              {
                label: 'Manage your saved content (used to save tracks)',
                value: Mode.SaveTracks,
              },
            ]}
            value={extraModes}
            defaultValue={[Mode.SeePrivateLists]}
            onChange={(v) => setExtraModes(v as Mode[])}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Form.Item>
        <Divider style={{ margin: '0 0 15px' }} />
        <Form.Item>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember me?
          </Checkbox>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={() => {
          const scope = _.uniq([
            ...requiredScopes,
            ...extraModes.flatMap((mode) => extraModesDef[mode].scopes),
          ])

          if (rememberMe) saveLocal(scope)

          const state = rString()
          setPreAuthState({ state, scope })
          window.open(
            `https://accounts.spotify.com/authorize?${spotifyAuthParams(
              scope,
              state,
            )}`,
            'authorize',
          )
        }}
      >
        Log in
      </Button>
      <style jsx>{`
        h2 {
          margin-top: 50px;
          display: flex;
        }
        h2 .img {
          margin-right: 7px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export default ScopeSelector
