import React from 'react'
import ReactDOM from 'react-dom'
import App from '../../../components/App'

export const content_initReactApp = (tabId: number) => {
  const existingDiv = document.getElementById('endoh-extension')
  if (existingDiv) {
    existingDiv.remove()
  }

  const div = document.createElement('div')
  div.id = 'endoh-extension'

  if (!document.querySelector('#endoh-extension')) {
    const root = document.getElementById('root')
    if (root) {
      root.append(div)
    } else {
      document.body.append(div)
    }

    ReactDOM.render(
      <React.StrictMode>
        <App tabId={tabId} />
      </React.StrictMode>,
      div
    )
  }
}
