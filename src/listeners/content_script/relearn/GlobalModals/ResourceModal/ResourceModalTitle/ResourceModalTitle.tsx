import React from 'react'
import { ResourceDto } from '../../../../../../types/domains/resources/ResourceDto'

type Props = {
  resource: ResourceDto
}

const ResourceModalTitle = ({ ...props }: Props) => {
  return (
    <div className="ResourceModalTitle">
      <div>{props.resource.id ? 'Edit Resource' : 'Add Resource'}</div>
    </div>
  )
}

export default ResourceModalTitle
