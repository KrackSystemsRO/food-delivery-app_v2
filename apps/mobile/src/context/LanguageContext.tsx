import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../utils/translationLocales/i18n";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
};

const LANGUAGE_KEY = "APP_LANGUAGE";

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>("en");

  // Load language from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (storedLang) {
          setLanguageState(storedLang);
          i18n.changeLanguage(storedLang);
        } else {
          // default language
          i18n.changeLanguage("en");
        }
      } catch (e) {
        console.error("Failed to load language from storage", e);
      }
    })();
  }, []);

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      i18n.changeLanguage(lang);
      setLanguageState(lang);
    } catch (e) {
      console.error("Failed to save language to storage", e);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ro" : "en";
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
