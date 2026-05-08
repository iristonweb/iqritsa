import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      appTitle: "IQ-рица: Эволюция Интеллекта",
      offlineMode: "Офлайн режим: мультиплеер временно недоступен",
    },
  },
  en: {
    translation: {
      appTitle: "IQritsa: Intelligence Evolution",
      offlineMode: "Offline mode: multiplayer is temporarily unavailable",
    },
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "ru",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
