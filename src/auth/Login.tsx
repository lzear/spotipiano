import React from 'react'
import { Keyboard } from '../demo/Piano'
import ScopeSelector from './ScopeSelector'

export const Login: React.FC<{ sounds: string[] }> = ({ sounds }) => (
  <div className="splash">
    <h1>Create partitions from your music on Spotify.</h1>
    <h2>Demo with stock sound effects</h2>
    <Keyboard sounds={sounds} />
    <ScopeSelector />
    <style jsx>{`
      h1 {
        margin-bottom: 35px;
      }
      .splash {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 20px;
      }
      p {
        margin-bottom: 40px;
      }
    `}</style>
  </div>
)
