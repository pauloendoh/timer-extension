import React from 'react'

type Props = Omit<React.HTMLProps<HTMLAudioElement>, 'src'> & {
  src: string
  trackKind?: string
}

const MyAutoplayAudio = React.forwardRef<HTMLAudioElement, Props>(
  (props, ref) => {
    return (
      <audio ref={ref} autoPlay loop {...props}>
        <track kind="captions" />
      </audio>
    )
  }
)

export default MyAutoplayAudio
