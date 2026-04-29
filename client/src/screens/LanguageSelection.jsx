import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, setLanguage } from '../services/languageService';

export const LanguageSelection = ({onLanguageSelected}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);
  const navigatingRef = React.useRef(false);
  const { changeLanguage, t } = useLanguage();

  const handleLanguageSelect = async (language) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setSelectedLanguage(language);
    // Dropdown state removed in redesign
    await setLanguage(language);
    if (changeLanguage) await changeLanguage(language);
    await new Promise(resolve => setTimeout(resolve, 100));

    const { hasLanguageSelected, getLanguage } = require('../services/languageService');
    const verified = await hasLanguageSelected();
    const storedLang = await getLanguage();
    if (!verified || storedLang !== language) {
      await setLanguage(language);
      if (changeLanguage) await changeLanguage(language);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Brief delay for visual feedback, then auto-redirect
    setTimeout(() => {
      if (onLanguageSelected) onLanguageSelected();
      navigatingRef.current = false;
    }, 300);
  };

  const languages = [
    {
      code: LANGUAGES.MARATHI,
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      description: 'मराठी भाषा निवडा',
      gradient: ['#FF6B35', '#FF8C42']
    },
    {
      code: LANGUAGES.HINDI,
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      description: 'हिंदी भाषा चुनें',
      gradient: ['#FF8C42', '#FFA07A']
    },
    {
      code: LANGUAGES.ENGLISH,
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      description: 'Select English language',
      gradient: ['#FFA07A', '#FFB88C']
    },
  ];


  return (
    <LinearGradient
      colors={['#FF9933', '#FFD700', '#FF8C42', '#FF6B35']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{flex: 1}}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 24,
        }}
      >
        {/* Logo/Icon */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
          <Text style={{fontSize: 28}}>🔱</Text>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            marginBottom: 4,
          }}>
          {t('selectLanguage')}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: 16,
            fontWeight: '500',
          }}>
          भाषा चुनें / भाषा निवडा
        </Text>

        {/* Language Cards - compact */}
        <View style={{width: '100%', flexDirection: 'column', gap: 10, marginBottom: 20}}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.85}
              style={{
                backgroundColor: selectedLanguage === lang.code ? '#FF6B35' : 'rgba(255,255,255,0.95)',
                borderRadius: 12,
                borderWidth: selectedLanguage === lang.code ? 2 : 1,
                borderColor: selectedLanguage === lang.code ? '#FF8C42' : 'rgba(255,153,51,0.18)',
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: selectedLanguage === lang.code ? '#FF6B35' : '#000',
                shadowOpacity: selectedLanguage === lang.code ? 0.18 : 0.08,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 4,
                elevation: selectedLanguage === lang.code ? 4 : 2,
                gap: 12,
              }}
            >
              <Text style={{fontSize: 22}}>{lang.flag}</Text>
              <View style={{flex: 1}}>
                <Text style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: selectedLanguage === lang.code ? 'white' : '#FF6B35',
                  marginBottom: 1,
                }}>{lang.nativeName}</Text>
                <Text style={{
                  fontSize: 12,
                  color: selectedLanguage === lang.code ? 'white' : '#7C2D12',
                  fontWeight: '500',
                }}>{lang.name}</Text>
                <Text style={{
                  fontSize: 10,
                  color: selectedLanguage === lang.code ? 'white' : '#B85C1C',
                  marginTop: 1,
                }}>{lang.description}</Text>
              </View>
              {selectedLanguage === lang.code && (
                <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

