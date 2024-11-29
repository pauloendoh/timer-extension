import { Flex, FlexProps } from '@mantine/core'
import React from 'react'

export const FlexVCenter = React.forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex {...props} ref={ref} align="center" />
  }
)
