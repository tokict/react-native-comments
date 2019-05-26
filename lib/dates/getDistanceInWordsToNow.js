import { distanceInWordsToNow } from 'date-fns';

const dateFnsLocales = {
  en: require(`date-fns/locale/en`),
  fr: require(`date-fns/locale/fr`),
};

export const getDistanceInWordsToNow = (date, locale) => {
  const dateFnsLocale = dateFnsLocales[locale];
  return distanceInWordsToNow(new Date(date), { locale: dateFnsLocale });
};
