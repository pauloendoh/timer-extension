import { ActionIcon, Box, Button, Flex, TextInput, Title } from '@mantine/core'
import { useIntersection } from '@mantine/hooks'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { getSync, setSync } from '../../../utils/chromeStoragePromises'
import { syncKeys } from '../../../utils/syncKeys'
import { FlexCol } from '../../_shared/boxes/FlexCol'

type Props = {}

function stopAudio() {
  chrome.offscreen.closeDocument()
}

function startAudio() {
  chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('audio.html'),
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: 'notification',
  })
}

const DEVELOPER_TIMER_REDUCTION_MULTIPLIER =
  // process.env.NODE_ENV === 'development' ? 30 : 1
  1

const TimerPopup = ({ ...props }: Props) => {
  const [minutesInput, setMinutesInput] = useState('')
  const [remainingMs, setRemainingMs] = useState(0)
  const [isRinging, setIsRinging] = useState(false)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const prepare = async () => {
      const minutesInput = await getSync<string>(syncKeys.timer.minutesInput)
      const remainingMs = await getSync<number>(syncKeys.timer.remainingMs)
      const isRinging = await getSync<boolean>(syncKeys.timer.isRinging)

      if (minutesInput !== undefined) {
        setMinutesInput(minutesInput)
      }

      if (remainingMs !== undefined) {
        setRemainingMs(remainingMs)
      }

      if (isRinging !== undefined) {
        setIsRinging(isRinging)
      }

      setIsReady(true)
    }

    prepare()
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    setSync(syncKeys.timer.minutesInput, minutesInput)
    setSync(syncKeys.timer.remainingMs, remainingMs)
    setSync(syncKeys.timer.isRinging, isRinging)
  }, [isReady, minutesInput, remainingMs, isRinging])

  const canSubmit = useMemo(() => {
    if (remainingMs || isRinging) {
      return false
    }

    const minutesNumberValue = Number(minutesInput)

    if (isNaN(minutesNumberValue)) {
      return false
    }

    if (minutesNumberValue <= 0) {
      return false
    }

    return true
  }, [minutesInput, remainingMs, isRinging])

  useEffect(() => {
    if (isRinging) {
      startAudio()
    } else {
      stopAudio()
    }
  }, [isRinging])

  const timerInterval = useRef<NodeJS.Timeout>()

  const getFormattedTimeRemaining = (remainingMs: number) => {
    const minutes = Math.floor(remainingMs / 1000 / 60)
    const seconds = Math.floor((remainingMs / 1000) % 60)

    if (minutes === 0 && seconds === 0) {
      return ''
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    const minutesNumberValue = Number(minutesInput)

    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }

    const totalMillis = minutesNumberValue * 60 * 1000

    setRemainingMs(totalMillis)

    timerInterval.current = setInterval(() => {
      setRemainingMs((prev) => {
        const newValue = prev - 1000 * DEVELOPER_TIMER_REDUCTION_MULTIPLIER

        if (newValue <= 0 && timerInterval.current) {
          clearInterval(timerInterval.current)
          setIsRinging(true)

          return 0
        }

        return newValue
      })
    }, 1000)
  }

  const formattedTimeRemaining = useMemo(() => {
    return getFormattedTimeRemaining(remainingMs)
  }, [remainingMs])

  useEffect(() => {
    if (formattedTimeRemaining !== '') {
      chrome.action.setBadgeText({
        text: formattedTimeRemaining,
      })
      chrome.action.setBadgeBackgroundColor({
        color: 'orange',
      })
    } else {
      if (isRinging) {
        chrome.action.setBadgeText({
          text: '🔔',
        })
        chrome.action.setBadgeBackgroundColor({
          color: '#ff0000',
        })
      } else {
        chrome.action.setBadgeText({
          text: '',
        })
      }
    }
  }, [formattedTimeRemaining, isRinging])

  const inputRef = useRef<HTMLInputElement>(null)
  const { ref: containerRef, entry } = useIntersection<HTMLInputElement>()

  useEffect(() => {
    if (entry?.isIntersecting) {
      inputRef.current?.focus()
    }
  }, [entry])

  return (
    <Box ref={containerRef}>
      <FlexCol gap={16}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            startTimer()
          }}
        >
          <Flex align={'flex-end'} gap={8}>
            <TextInput
              ref={inputRef}
              label="Timer (in minutes)"
              placeholder="Enter timer value"
              value={minutesInput ?? ''}
              onChange={(e) => {
                setMinutesInput(e.currentTarget.value)
              }}
            />
            <Button type="submit" disabled={!canSubmit}>
              Start
            </Button>
          </Flex>
        </form>

        {!!formattedTimeRemaining && (
          <Flex direction="column">
            <Flex align="center" justify={'space-between'}>
              <Title order={1}>{formattedTimeRemaining}</Title>
              <ActionIcon
                size="xl"
                onClick={() => {
                  setRemainingMs(0)
                  // setLastStoppedAt(new Date())
                  if (timerInterval.current) {
                    clearInterval(timerInterval.current)
                  }
                }}
              >
                <MdClose fontSize={24} />
              </ActionIcon>
            </Flex>
          </Flex>
        )}

        {isRinging && (
          <Flex direction={'column'}>
            <Button
              onClick={() => {
                setIsRinging(false)
                // setLastStoppedAt(new Date())
              }}
              color="red"
            >
              Stop
              {/* ({autoStoppingInMs && autoStoppingInMs / 1000}) */}
            </Button>
          </Flex>
        )}
      </FlexCol>
    </Box>
  )
}

export default TimerPopup
