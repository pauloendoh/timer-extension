import { Paper, Text, useMantineTheme } from '@mantine/core'
import React, { useMemo } from 'react'
import { FaFire } from 'react-icons/fa'
import { format } from 'timeago.js'
import { FlexVCenter } from '../../../components/_UI/boxes/FlexVCenter'
import { ResourceDto } from '../../../types/domains/resources/AlreadyRatedResourceDto'
import { ratingLabels } from './ratingLabels/ratingLabels'

type Props = {
  resource: ResourceDto
}

const ResourcePopup = (props: Props) => {
  const theme = useMantineTheme()
  const bgColor = useMemo(() => {
    if (props.resource.rating === null) {
      return theme.colors.gray[5]
    }

    return theme.colors.yellow[6]
  }, [props.resource.rating])

  const label = useMemo(() => {
    if (props.resource.rating === null) {
      return 'Bookmarked'
    }

    const ratedAt = format(props.resource.completedAt)
    return `${props.resource.rating}/5 - ${
      ratingLabels[props.resource.rating]
    } (${ratedAt})`
  }, [props.resource.rating])

  return (
    <Paper p={8} bg={bgColor}>
      <FlexVCenter gap={4}>
        <FaFire />
        <Text sx={{ fontSize: 14 }}>{label}</Text>
      </FlexVCenter>
    </Paper>
  )
}

export default ResourcePopup
