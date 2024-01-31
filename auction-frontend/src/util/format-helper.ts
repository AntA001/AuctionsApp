import moment from 'moment/moment';

export const timeLeft = (date: string) => {
  const endDate = moment(date);
  const now = moment();
  if (now.isAfter(endDate)) {
    return 'FINISHED';
  }

  //Replaced moment's from now with diff for seconds-level precision
  const duration = moment.duration(endDate.diff(now));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  // Construct time left string with only non-zero units
  let timeLeftStr = '';

  if (days > 0) timeLeftStr += `${days}d `;
  if (hours > 0) timeLeftStr += `${hours.toString().padStart(2, '0')}h `;
  if (minutes > 0) timeLeftStr += `${minutes.toString().padStart(2, '0')}m `;
  if (seconds > 0) timeLeftStr += `${seconds.toString().padStart(2, '0')}s`;

  return timeLeftStr.trim() + ' left'; // Trim to remove any whitespace
};
