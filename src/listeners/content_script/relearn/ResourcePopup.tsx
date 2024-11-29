import { Paper, Text, useMantineTheme } from '@mantine/core'
import React, { useEffect, useMemo } from 'react'
import { FaFire } from 'react-icons/fa'
import { format } from 'timeago.js'
import { FlexVCenter } from '../../../components/_shared/boxes/FlexVCenter'
import useResourceModalStore from '../../../hooks/zustand/useResourceModalStore'
import { ResourceDto } from '../../../types/domains/resources/ResourceDto'
import { ratingLabels } from './ratingLabels/ratingLabels'

type Props = {
  initialResource: ResourceDto
}

const ResourcePopup = (props: Props) => {
  const theme = useMantineTheme()
  const { openModal, setInitialValue, initialValue } = useResourceModalStore()

  useEffect(() => {
    setInitialValue(props.initialResource)
  }, [])

  const bgColor = useMemo(() => {
    if (initialValue.rating === null) {
      return theme.colors.gray[5]
    }

    return theme.colors.yellow[6]
  }, [initialValue.rating])

  const label = useMemo(() => {
    if (initialValue.rating === null) {
      return 'Bookmarked'
    }

    const ratedAt = format(initialValue.completedAt)
    return `${initialValue.rating}/5 - ${
      ratingLabels[initialValue.rating]
    } (${ratedAt})`
  }, [initialValue.rating])

  return (
    <Paper
      p={8}
      bg={bgColor}
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => {
        openModal(initialValue)
      }}
    >
      <FlexVCenter gap={4}>
        <FaFire />
        <Text sx={{ fontSize: 14 }}>{label}</Text>
      </FlexVCenter>
    </Paper>
  )
}

export default ResourcePopup
