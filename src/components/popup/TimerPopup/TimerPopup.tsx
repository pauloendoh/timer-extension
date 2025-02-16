import {
  ActionIcon,
  Box,
  Button,
  Flex,
  NumberInput,
  Title,
} from '@mantine/core'
import { useIntersection } from '@mantine/hooks'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { getSync, setSync } from '../../../utils/chromeStoragePromises'
import { messageTypes } from '../../../utils/messageTypes'
import { syncKeys } from '../../../utils/syncKeys'
import { FlexCol } from '../../_shared/boxes/FlexCol'
import { getFormattedTimeRemaining } from './getFormattedTimeRemaining/getFormattedTimeRemaining'

type Props = {}

function stopAudio() {
  chrome.offscreen.closeDocument()
}

const DEVELOPER_TIMER_REDUCTION_MULTIPLIER =
  // process.env.NODE_ENV === 'development' ? 30 : 1
  1

const TimerPopup = ({ ...props }: Props) => {
  const [minutesInput, setMinutesInput] = useState<number | undefined>(0)
  const [secondsInput, setSecondsinput] = useState<number | undefined>(0)
  const [remainingMs, setRemainingMs] = useState(0)
  const [isRinging, setIsRinging] = useState(false)

  const [isReady, setIsReady] = useState(false)

  const [shouldAutoStart, setShouldAutoStart] = useState(false)

  useEffect(() => {
    const prepare = async () => {
      const minutesInputVal = await getSync<number>(syncKeys.timer.minutesInput)
      const secondsInputVal = await getSync<number>(syncKeys.timer.secondsInput)

      chrome.runtime.sendMessage(
        {
          type: messageTypes.getRemainingMs,
        },
        (response) => {
          setRemainingMs(response)

          if (response > 0) {
            setShouldAutoStart(true)
          }

          if (minutesInputVal !== undefined) {
            setMinutesInput(minutesInputVal)
          }

          if (secondsInputVal !== undefined) {
            setSecondsinput(secondsInputVal)
          }
        }
      )

      setIsReady(true)
    }

    prepare()
  }, [])

  useEffect(() => {
    if (shouldAutoStart) {
      startTimer(remainingMs)
    }
  }, [shouldAutoStart])

  // não lembro pra que é isso
  // useEffect(() => {
  //   if (!isReady) {
  //     return
  //   }

  //   setSync(syncKeys.timer.minutesInput, minutesInput)
  //   setSync(syncKeys.timer.secondsInput, secondsInput)
  //   setSync(syncKeys.timer.remainingMs, remainingMs)
  //   setSync(syncKeys.timer.isRinging, isRinging)
  // }, [isReady, minutesInput, secondsInput, remainingMs, isRinging])

  useEffect(() => {
    if (isRinging) {
      // startAudio()
    } else {
      stopAudio()
    }
  }, [isRinging])

  const timerInterval = useRef<NodeJS.Timeout>()

  const startTimer = (totalMillis: number) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }

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
      inputRef.current?.select()
    }
  }, [entry])

  const minutesAndSecondsInMillis = useMemo(() => {
    return Number(minutesInput) * 60 * 1000 + Number(secondsInput) * 1000
  }, [minutesInput, secondsInput])

  const canSubmit = useMemo(() => {
    if (remainingMs || isRinging) {
      return false
    }

    if (minutesAndSecondsInMillis <= 0) {
      return false
    }

    return true
  }, [minutesAndSecondsInMillis, remainingMs, isRinging])

  return (
    <Box ref={containerRef}>
      <FlexCol gap={16}>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            setSync(syncKeys.timer.minutesInput, minutesInput)
            setSync(syncKeys.timer.secondsInput, secondsInput)

            startTimer(minutesAndSecondsInMillis)

            chrome.runtime.sendMessage({
              type: messageTypes.startTimer,
              totalMillis: minutesAndSecondsInMillis,
            })
          }}
        >
          <Flex align={'flex-end'} gap={8}>
            <NumberInput
              ref={inputRef}
              label="Minutes"
              value={minutesInput}
              onChange={(val) => {
                setMinutesInput(val ?? 0)
              }}
              min={0}
            />
            <NumberInput
              label="Seconds"
              value={secondsInput}
              onChange={(val) => {
                setSecondsinput(val ?? 0)
              }}
              min={0}
              max={59}
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

                  chrome.runtime.sendMessage({
                    type: messageTypes.cancelTimer,
                  })
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
