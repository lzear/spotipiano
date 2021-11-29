import { ReloadOutlined } from '@ant-design/icons'
import { Button, Spin } from 'antd'
import React from 'react'
import { useQuery } from 'react-query'
import { getDevices } from '../spotify/SpotifyQuerier'
import {
  selectAuth,
  selectDeviceID,
  selectSetDeviceID,
  selectSetNoAutoDevice,
} from '../store/selectors'
import { useStore } from '../store/zustand'
import { Device } from '../store'

export const useDevice = () => {
  const deviceID = useStore(selectDeviceID)
  const auth = useStore(selectAuth)
  const { data } = useQuery(['devices', auth?.accessToken ?? ''], getDevices, {
    enabled: !!auth?.accessToken,
  })
  const device = data?.devices?.find((d) => d.id === deviceID)
  return { loading: !data, device }
}

export const DeviceMenuItem: React.FC<{
  close: () => void
  device: Device | undefined
  loading: boolean
}> = ({ close, device, loading }) => {
  if (loading) return <Spin />
  if (device) return <>Device: {device.name}</>
  return (
    <>
      You must select a device before playing a song
      <DevicePickerAlert close={close} />
    </>
  )
}

export const DevicePicker: React.FC = () => {
  const setNoAutoDevice = useStore(selectSetNoAutoDevice)

  const { device } = useDevice()

  if (device)
    return (
      <div>
        Device: {device.name}
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            setNoAutoDevice()
          }}
        >
          Change
        </Button>
      </div>
    )

  return <DevicePickerAlert />
}

const DevicePickerAlert: React.FC<{ close?: () => void }> = ({ close }) => {
  const auth = useStore(selectAuth)
  const setDeviceID = useStore(selectSetDeviceID)

  const { data, refetch } = useQuery(
    ['devices', auth?.accessToken ?? ''],
    getDevices,
    { enabled: !!auth?.accessToken },
  )

  if (!data) return <Spin />
  if (!data?.devices.length)
    return (
      <div>
        Please open Spotify on your device (
        <ReloadOutlined onClick={() => refetch()} />)
      </div>
    )
  return (
    <div>
      {data.devices.map((d) => (
        <Button
          key={d.id}
          onClick={() => {
            setDeviceID(d.id)
            close?.()
          }}
        >
          {d.type} - {d.name}
        </Button>
      ))}
    </div>
  )
}
