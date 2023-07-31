import { Center, Loader, Modal } from '@mantine/core'
import React, { useEffect } from 'react'
import { messageTypes } from '../../../../../utils/messageTypes'

type Props = {}

const LoadingModal = ({ ...props }: Props) => {
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    window.addEventListener(messageTypes.openLoadingModal, (event) => {
      console.log('openLoadingModal')
      setOpen(true)
    })

    window.addEventListener(messageTypes.closeLoadingModal, (event) => {
      console.log('closeLoadingModal')
      setOpen(false)
    })

    return () => {
      window.removeEventListener(messageTypes.openLoadingModal, () => {})
      window.removeEventListener(messageTypes.closeLoadingModal, () => {})
    }
  }, [])

  return (
    <Modal
      withinPortal
      zIndex={1000000}
      size="xs"
      opened={open}
      onClose={() => {}}
      withCloseButton={false}
    >
      <Center h={200}>
        <Loader />
      </Center>
    </Modal>
  )
}

export default LoadingModal
