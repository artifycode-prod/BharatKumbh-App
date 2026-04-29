import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLanguage, setLanguage as saveLanguage, LANGUAGES, translations as translationsData } from '../services/languageService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.ENGLISH);
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [languageVersion, setLanguageVersion] = useState(0);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const lang = await getLanguage();
      console.log('📱 LanguageContext - Loading language:', lang);
      
      if (lang && lang.trim() !== '') {
        // Valid language found
        setCurrentLanguage(lang);
        const trans = translationsData[lang] || translationsData[LANGUAGES.ENGLISH];
        setTranslations(trans);
        console.log('✅ LanguageContext - Language loaded:', lang);
      } else {
        // No language set, use default
        console.log('⚠️ LanguageContext - No language found, using default:', LANGUAGES.ENGLISH);
        setCurrentLanguage(LANGUAGES.ENGLISH);
        const trans = translationsData[LANGUAGES.ENGLISH];
        setTranslations(trans);
      }
    } catch (error) {
      console.error('❌ LanguageContext - Error loading language:', error);
      setCurrentLanguage(LANGUAGES.ENGLISH);
      const trans = translationsData[LANGUAGES.ENGLISH];
      setTranslations(trans);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (language) => {
    try {
      console.log('🔄 LanguageContext - Changing language to:', language);
      await saveLanguage(language);
      const lang = language || LANGUAGES.ENGLISH;
      const trans = translationsData[lang] || translationsData[LANGUAGES.ENGLISH];
      setCurrentLanguage(lang);
      setTranslations(trans);
      setLanguageVersion((v) => v + 1); // Force all consumers to re-render
      console.log('✅ LanguageContext - Language changed to:', lang);
    } catch (error) {
      console.error('❌ LanguageContext - Error changing language:', error);
    }
  };

  const t = (key) => {
    return translations?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      translations, 
      changeLanguage, 
      t,
      loading,
      languageVersion 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

