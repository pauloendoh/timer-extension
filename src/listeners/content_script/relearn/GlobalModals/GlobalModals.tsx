import React from 'react'
import ResourceModal from './ResourceModal/ResourceModal'

type Props = {}

const GlobalDialogs = ({ ...props }: Props) => {
  return (
    <div className="GlobalDialogs">
      <div>GlobalDialogs</div>
      <ResourceModal />
    </div>
  )
}

export default GlobalDialogs
