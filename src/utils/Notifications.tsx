import React from 'react'
import { notification } from 'antd'
import { NotificationInstance } from 'antd/lib/notification'

export const NotificationContext = React.createContext<NotificationInstance>(
  {} as NotificationInstance,
)

export const NotificationsProvider: React.FC = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()
  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
