import React from 'react'
import { NextPage } from 'next'
import { Save } from '../partition/Save'
import { PPPartition } from '../partition/PPPartition'
import { Tabs } from '../tracks/Tabs'
import SoundBoard from '../sound-board/SoundBoard'
import AuthProvider from '../auth/AuthProvider'
import { Typography } from 'antd'

// const AuthedMain = dynamic(() => import('../auth/AuthProvider'))

const { Title } = Typography

export const Home: NextPage<{ sounds: string[] }> = ({ sounds }) => (
  <AuthProvider sounds={sounds}>
    <Title level={2}>1. Find tracks</Title>
    <Tabs />
    <SoundBoard editable />
    <PPPartition />
    <Save />
  </AuthProvider>
)

//
// export const Home: NextPage = process.browser
//   ? () => (
//       <AuthedMain>
//         <Tabs />
//         <DrumBox editable />
//         <PPPartition />
//         <SaveButton />
//       </AuthedMain>
//     )
//   : AutoLogin
