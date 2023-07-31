import {
  Box,
  Flex,
  Modal,
  Rating,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from '@mantine/core'
import { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FlexCol } from '../../../../../components/_UI/boxes/FlexCol'
import SaveCancelButtons from '../../../../../components/_UI/buttons/SaveCancelButtons'
import { useAxios } from '../../../../../hooks/useAxios'
import useResourceModalStore from '../../../../../hooks/zustand/useResourceModalStore'
import { ResourceDto } from '../../../../../types/domains/resources/ResourceDto'
import { messageTypes } from '../../../../../utils/messageTypes'
import { urls } from '../../../../../utils/urls'
import RelearnContext from '../../RelearnContext/RelearnContext'
import ResourceModalTitle from './ResourceModalTitle/ResourceModalTitle'
import ResourceThumbnail from './ResourceThumbnail/ResourceThumbnail'

type Props = {}

const ResourceModal = ({ ...props }: Props) => {
  const { initialValue, isOpen, closeModal, setInitialValue, openModal } =
    useResourceModalStore()

  // PE 1/3 - não ta sendo usado.. remover tudo?
  const { tabId } = React.useContext(RelearnContext)

  const [loading, setLoading] = React.useState(false)
  const theme = useMantineTheme()
  const form = useForm<ResourceDto>({
    defaultValues: initialValue,
  })

  useEffect(() => {
    window.addEventListener(messageTypes.openResourceModal, (event) => {
      console.log({
        event,
      })
      const detail = (event as CustomEvent).detail
      const resource = detail.resource as ResourceDto

      console.log({
        resource,
      })
      openModal(resource)
    })

    return () => {
      window.removeEventListener(messageTypes.openResourceModal, () => {})
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      form.reset(initialValue)

      setTimeout(() => {
        form.setFocus('title')
      }, 100)
    }
  }, [isOpen])

  const axios = useAxios()

  const handleSubmit = (payload: ResourceDto) => {
    setLoading(true)

    axios
      .post<ResourceDto>(urls.api.relearn.resource, payload)
      .then(async (res) => {
        // const currentResources = [...resources]

        const savedResource = res.data

        if (!savedResource) {
          alert('Resource not found')
          return
        }

        setInitialValue(savedResource)
        // setResources(res.data)
        alert('Resource saved! 😀')
        // setSuccessMessage(<ResourceSavedMessage allResources={res.data} />)

        // if (closeAfterSaving) {
        //   closeAndClearQueryParam()
        //   return
        // }

        // let newResource = res.data.find((r) => r.id === resource.id)
        // if (!newResource) {
        //   // Why should this happen?
        //   alert("Resource not found")
        //   const prevResourcesIds = currentResources.map((r) => r.id)
        //   newResource = res.data.find((r) => !prevResourcesIds.includes(r.id))
        // }

        // if (newResource) {
        //   const tag = editingResource?.tag || getCurrentTag()!
        //   setInitialValues({
        //     ...newResource,
        //     tag: {
        //       ...tag,
        //     },
        //   })
        // }

        closeModal()
      })
      .catch((err: AxiosError) => {
        alert('Error while saving resource: ' + err.message)
        // setErrorMessage(err.message || "Error while saving resource.")
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      withinPortal
      zIndex={1000000}
      size="xl"
      opened={isOpen}
      onClose={closeModal}
      title={<ResourceModalTitle resource={form.watch()} />}
      withCloseButton={false}
      styles={{
        modal: {
          background: theme.colors.dark[5],
        },
      }}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FlexCol gap={8}>
          <Flex gap={16}>
            {!!form.watch('thumbnail')?.length && (
              <FlexCol>
                <Text>Thumbnail</Text>
                <ResourceThumbnail
                  resource={form.watch()}
                  onChangeThumbnail={(value) => {
                    form.setValue('thumbnail', value)
                  }}
                />
              </FlexCol>
            )}

            <FlexCol
              gap={8}
              sx={{
                flexGrow: 1,
              }}
            >
              <TextInput required {...form.register('title')} label="Title" />
              <TextInput {...form.register('url')} label="Url" />
            </FlexCol>
          </Flex>
          <Flex gap={16}>
            <TextInput
              {...form.register('estimatedTime')}
              label="Duration"
              w={80}
            />

            <FlexCol gap={8}>
              <Text>Rate this resource</Text>
              <Rating
                value={form.watch('rating') || undefined}
                onChange={(value) => {
                  form.setValue('rating', value)
                }}
              />
            </FlexCol>
          </Flex>

          <Textarea
            autosize
            {...form.register('publicReview')}
            label="Public review"
          />

          <Textarea
            autosize
            {...form.register('privateNote')}
            label="Private note"
          />

          <Box mt={16}>
            <SaveCancelButtons
              onCancel={closeModal}
              isLoading={loading}
              onEnabledAndCtrlEnter={() => {
                handleSubmit(form.getValues())
              }}
            />
          </Box>
        </FlexCol>
      </form>
    </Modal>
  )
}

export default ResourceModal
