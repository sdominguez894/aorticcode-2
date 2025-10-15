import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ca from "@/locales/ca.json";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

/**
 * i18n configuration
 * Configures internationalization with Catalan, Spanish, and English support
 * Includes automatic language detection from localStorage and browser settings
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "ca",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
