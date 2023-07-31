import React from 'react'
import LoadingModal from './LoadingModal/LoadingModal'
import ResourceModal from './ResourceModal/ResourceModal'

type Props = {}

const GlobalModals = ({ ...props }: Props) => {
  return (
    <div className="GlobalModals">
      <ResourceModal />
      <LoadingModal />
    </div>
  )
}

export default GlobalModals
