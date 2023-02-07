import { NotificationsProvider } from '@mantine/notifications'

import { Button, LoadingOverlay, MantineProvider, Paper } from '@mantine/core'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import LoginForm from './components/LoginForm/LoginForm'
import useCheckAuthOrLogout from './hooks/useCheckAuthUserOrLogout'
import { useLogout } from './hooks/useLogout'
import useAuthStore from './hooks/zustand/useAuthStore'

const Popup = () => {
  const { checkAuthOrLogout, loading } = useCheckAuthOrLogout()

  useEffect(() => {
    checkAuthOrLogout()
  }, [])

  const authUser = useAuthStore((s) => s.authUser)
  const logout = useLogout()

  return (
    <Paper sx={{ width: 300, minHeight: 300, padding: 16 }}>
      <LoadingOverlay visible={loading} opacity={1} />
      Hello {authUser?.username}
      <LoginForm />
      <Button color="red" onClick={logout}>
        Logout
      </Button>
    </Paper>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <NotificationsProvider>
        <Popup />
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
