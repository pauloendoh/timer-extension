import { MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { ResourceDto } from '../../../types/domains/resources/AlreadyRatedResourceDto'
import { myTheme } from '../../../utils/myTheme'
import ResourcePopup from './ResourcePopup'

export const bgHandleResource = (resource: ResourceDto) => {
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
      <MantineProvider
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
          <ResourcePopup resource={resource} />
        </div>
      </MantineProvider>
    </React.StrictMode>,
    div
  )
}
