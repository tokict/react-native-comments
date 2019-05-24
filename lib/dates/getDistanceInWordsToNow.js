import { distanceInWordsToNow } from 'date-fns';

export const getDistanceInWordsToNow = (date, locale) => {
  const dateFnsLocale = require(`date-fns/locale/${locale}`)
  return distanceInWordsToNow(new Date(date), { locale: dateFnsLocale });
}
