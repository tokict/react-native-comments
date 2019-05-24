import {frLocale} from 'date-fns/locale/fr';
import {distanceInWordsToNow} from 'date-fns';

export const getDistanceInWordsToNow = (date) => {
  return distanceInWordsToNow(date, {locale: frLocale});
}
