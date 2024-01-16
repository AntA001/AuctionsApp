import moment from 'moment/moment'

export const timeLeft = (date: string) => {
  return (
    moment(date)
      .fromNow(true)
      .replace('seconds', 's')
      .replace('minutes', 'm')
      .replace('hours', 'h')
      .replace('days', 'd')
      .replace('a day', '1d')
      .replace(/\s/, '') + ' left'
  )
}
