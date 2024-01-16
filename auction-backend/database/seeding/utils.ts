import { TimeInterval } from './types'

export function futureDate(timeInterval: TimeInterval) {
  const date = new Date()
  if (timeInterval.seconds) {
    date.setSeconds(date.getSeconds() + timeInterval.seconds)
  }

  return date
}

export function pastDate(timeInterval: TimeInterval) {
  const date = new Date()
  if (timeInterval.seconds) {
    date.setSeconds(date.getSeconds() - timeInterval.seconds)
  }

  return date
}
