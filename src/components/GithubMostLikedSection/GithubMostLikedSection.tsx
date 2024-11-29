import { ActionIcon, Paper } from '@mantine/core'
import React from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FlexVCenter } from '../_shared/boxes/FlexVCenter'

type Props = {
  tabId: number
}

const GithubMostLikedSection = ({ ...props }: Props) => {
  return (
    <Paper className="GithubMostLikedSection" bg="dark">
      <FlexVCenter p={4} gap={16}>
        <ActionIcon
          onClick={() => {
            chrome.runtime.sendMessage({
              command: 'prevIssue',
            })
          }}
        >
          <FaArrowLeft />
        </ActionIcon>

        <ActionIcon
          onClick={() => {
            chrome.runtime.sendMessage({
              command: 'nextIssue',
            })
          }}
        >
          <FaArrowRight />
        </ActionIcon>
      </FlexVCenter>
    </Paper>
  )
}

export default GithubMostLikedSection
