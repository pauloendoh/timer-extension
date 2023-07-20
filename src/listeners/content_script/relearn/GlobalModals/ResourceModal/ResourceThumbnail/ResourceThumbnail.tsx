import { ActionIcon, Box } from '@mantine/core'
import React from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { ResourceDto } from '../../../../../../types/domains/resources/ResourceDto'

type Props = {
  resource: ResourceDto
  onChangeThumbnail: (value: string) => void
}

const ResourceThumbnail = ({ ...props }: Props) => {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <Box mr={2} pos="relative">
      <a href={props.resource.url} target="_blank" rel="noreferrer">
        <img
          style={{ maxHeight: 90, maxWidth: 200 }}
          alt="link-preview-thumbnail"
          src={props.resource.thumbnail}
          onError={(e: any) => {
            e.target.onerror = null
            // e.target.src = linkPng
            e.target.alt = 'default-link-thumbnail'
          }}
          onLoad={() => {
            setLoaded(true)
          }}
        />
      </a>
      {loaded && (
        <ActionIcon
          onClick={() => {
            props.onChangeThumbnail('')
          }}
          size="sm"
          style={{ position: 'absolute', right: 0, top: 0 }}
        >
          <IoMdCloseCircleOutline />
        </ActionIcon>
      )}
    </Box>
  )
}

export default ResourceThumbnail
