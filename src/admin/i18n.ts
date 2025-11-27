import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en/common.json'
import ht from './locales/ht/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ht: { common: ht },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ht'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'] },
  })

export default i18n
