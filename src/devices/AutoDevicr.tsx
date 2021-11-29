import {
  selectAuth,
  selectDeviceID,
  selectNoAutoDevice,
  selectSetDeviceID,
} from '../store/selectors'
import { getDevices } from '../spotify/SpotifyQuerier'
import { useQuery } from 'react-query'
import React, { useEffect } from 'react'
import { useStore } from '../store/zustand'

export const useAutoDevice = () => {
  const auth = useStore(selectAuth)
  const deviceID = useStore(selectDeviceID)
  const setDeviceID = useStore(selectSetDeviceID)
  const noAutoDevice = useStore(selectNoAutoDevice)
  const { data } = useQuery(['devices', auth?.accessToken ?? ''], getDevices, {
    enabled: !!auth?.accessToken,
  })
  useEffect(() => {
    if (data && data?.devices.length === 1 && !noAutoDevice) {
      const onlyDeviceId = data?.devices?.[0].id
      if (onlyDeviceId && onlyDeviceId !== deviceID) setDeviceID(onlyDeviceId)
    }
  }, [data, deviceID, setDeviceID])
}

export const AutoDevicr: React.FC = () => {
  useAutoDevice()
  return null
}
