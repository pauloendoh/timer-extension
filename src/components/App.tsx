import { MantineProvider } from '@mantine/core'
import React, { useEffect, useMemo, useState } from 'react'
import GlobalModals from '../listeners/content_script/relearn/GlobalModals/GlobalModals'
import RelearnContext from '../listeners/content_script/relearn/RelearnContext/RelearnContext'
import ResourcePopup from '../listeners/content_script/relearn/ResourcePopup'
import { ResourceDto } from '../types/domains/resources/ResourceDto'
import { isValidGithubPage } from '../utils/github-issues/isValidGithubPage'
import { messageTypes } from '../utils/messageTypes'
import { myTheme } from '../utils/myTheme'
import GithubMostLikedSection from './GithubMostLikedSection/GithubMostLikedSection'

type Props = {
  tabId: number
}

const App = ({ ...props }: Props) => {
  const [foundResource, setFoundResource] = useState<ResourceDto>()

  const isGithubPage = useMemo(() => {
    return isValidGithubPage(window.location.href)
  }, [])

  useEffect(() => {
    window.addEventListener(messageTypes.foundResource, (event) => {
      const detail = (event as CustomEvent).detail
      const resource = detail.resource as ResourceDto
      setFoundResource(resource)
    })

    return () => {
      window.removeEventListener(messageTypes.foundResource, () => {})
    }
  }, [])

  return (
    <RelearnContext.Provider
      value={{
        tabId: props.tabId,
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
        {foundResource && (
          <div
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <ResourcePopup initialResource={foundResource} />
          </div>
        )}

        {isGithubPage && (
          <div
            style={{
              position: 'fixed',
              bottom: 16,
              right: 80,
              zIndex: 1000,
            }}
          >
            <GithubMostLikedSection tabId={props.tabId} />
          </div>
        )}

        <GlobalModals />
      </MantineProvider>
    </RelearnContext.Provider>
  )
}

export default App
