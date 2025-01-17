import { NotificationsProvider } from '@mantine/notifications'

import { MantineProvider, Paper } from '@mantine/core'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import TimerPopupRaw from './components/popup/TimerPopup/TimerPopup'
import useCheckAuthOrLogout from './hooks/useCheckAuthUserOrLogout'
import { myTheme } from './utils/myTheme'

const Popup = () => {
  const { checkAuthOrLogout, loading } = useCheckAuthOrLogout()

  useEffect(() => {
    checkAuthOrLogout()
  }, [])

  return (
    <Paper sx={{ width: 300, minHeight: 300, padding: 16 }}>
      {/* <LoadingOverlay visible={loading} opacity={1} />
      Hello {authUser?.username}
      <LoginForm />
      <Button color="red" onClick={logout}>
        Logout
      </Button> */}
      <TimerPopupRaw />
    </Paper>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        ...myTheme,
        colorScheme: 'dark',
      }}
    >
      <NotificationsProvider>
        <Popup />
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
