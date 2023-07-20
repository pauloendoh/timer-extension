// create a react context in typescript that has a tabId: number

import { createContext } from 'react'

const RelearnContext = createContext<{
  tabId: number
}>({
  tabId: 0,
})

export default RelearnContext
