import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Saarkar Seva",
      select_language: "Select Your Language",
      continue: "Continue",
      find_schemes: "Find My Schemes",
      // Add more as needed
    }
  },
  hi: {
    translation: {
      welcome: "सरकार सेवा में आपका स्वागत है",
      select_language: "अपनी भाषा चुनें",
      continue: "जारी रखें",
      find_schemes: "मेरी योजनाएं खोजें",
    }
  },
  // Other 10 languages will be added similarly
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
