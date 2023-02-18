import { Flex, FlexProps } from '@mantine/core'
import React from 'react'

export const FlexCol = React.forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex {...props} ref={ref} direction="column" />
  }
)
