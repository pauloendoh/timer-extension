import { MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { ResourceDto } from '../../../types/domains/resources/ResourceDto'
import { myTheme } from '../../../utils/myTheme'
import GlobalDialogs from './GlobalModals/GlobalModals'
import RelearnContext from './RelearnContext/RelearnContext'
import ResourcePopup from './ResourcePopup'

export const csHandleResource = (
  initialResource: ResourceDto,
  tabId: number
) => {
  const existingDiv = document.getElementById('endoh-extension')
  if (existingDiv) {
    existingDiv.remove()
  }

  const div = document.createElement('div')
  div.id = 'endoh-extension'

  const root = document.getElementById('root')
  if (root) {
    root.append(div)
  } else {
    document.body.append(div)
  }

  ReactDOM.render(
    <React.StrictMode>
      <RelearnContext.Provider
        value={{
          tabId,
        }}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...myTheme,
            colorScheme: 'dark',
          }}
        >
          <div
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <ResourcePopup initialResource={initialResource} />
          </div>
          <GlobalDialogs />
        </MantineProvider>
      </RelearnContext.Provider>
    </React.StrictMode>,
    div
  )
}
