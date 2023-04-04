import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const TokenClock = () => {
  return (
  <CountdownCircleTimer
    isPlaying
    duration={300}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[60, 30, 15, 0]}
    size={65}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
  )
}

export default TokenClock