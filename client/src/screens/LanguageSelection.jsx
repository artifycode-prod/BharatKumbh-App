import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, setLanguage } from '../services/languageService';

export const LanguageSelection = ({onLanguageSelected}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { changeLanguage } = useLanguage();

  const handleLanguageSelect = async (language) => {
    console.log('🌐 Language selected:', language);
    setSelectedLanguage(language);
    setIsDropdownOpen(false); // Close dropdown after selection
    
    // Save language using service
    const saved = await setLanguage(language);
    console.log('💾 Language save result:', saved, 'for language:', language);
    
    // CRITICAL: Update the LanguageContext immediately
    if (changeLanguage) {
      await changeLanguage(language);
      console.log('✅ LanguageContext updated with:', language);
    }
    
    // Wait a bit for AsyncStorage to persist
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify it was saved correctly
    const { hasLanguageSelected, getLanguage } = require('../services/languageService');
    const verified = await hasLanguageSelected();
    const storedLang = await getLanguage();
    
    console.log('🔍 Language verification:', {
      saved,
      verified,
      storedLanguage: storedLang,
      expected: language,
      match: storedLang === language
    });
    
    if (!verified || storedLang !== language) {
      console.error('❌ Language save verification failed! Retrying...');
      // Try saving again
      await setLanguage(language);
      if (changeLanguage) {
        await changeLanguage(language);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Final verification
      const finalCheck = await hasLanguageSelected();
      const finalLang = await getLanguage();
      console.log('🔍 Final verification:', { finalCheck, finalLang });
    }
    
    // Small delay for visual feedback
    setTimeout(() => {
      console.log('✅ Language saved and context updated, navigating to Login');
      if (onLanguageSelected) {
        onLanguageSelected();
      }
    }, 300);
  };

  const getSelectedLanguageData = () => {
    return languages.find(lang => lang.code === selectedLanguage);
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
          Select Language
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: 24,
            fontWeight: '500',
          }}>
          भाषा चुनें / भाषा निवडा
        </Text>

        {/* Language Dropdown */}
        <View style={{width: '100%', position: 'relative'}}>
          {/* Dropdown Button */}
          <TouchableOpacity
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.9}
            style={{
              backgroundColor: selectedLanguage ? 'white' : 'rgba(255, 255, 255, 0.18)',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: selectedLanguage ? '#FF9933' : 'rgba(255, 255, 255, 0.5)',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {selectedLanguage ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    flex: 1,
                  }}>
                  <Text style={{fontSize: 20}}>
                    {getSelectedLanguageData()?.flag}
                  </Text>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#FF6B35',
                      }}>
                      {getSelectedLanguageData()?.nativeName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#6B7280',
                        fontWeight: '500',
                      }}>
                      {getSelectedLanguageData()?.name}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}>
                  <Text style={{fontSize: 18}}>🌐</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: 'white',
                    }}>
                    Choose Language
                  </Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 16,
                  color: selectedLanguage ? '#FF6B35' : 'white',
                  fontWeight: '600',
                }}>
                {isDropdownOpen ? '▲' : '▼'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <View
              style={{
                marginTop: 6,
                backgroundColor: 'white',
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#FF9933',
              }}>
              {languages.map((lang, index) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.code)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderBottomWidth: index < languages.length - 1 ? 0.5 : 0,
                    borderBottomColor: '#E5E7EB',
                    backgroundColor:
                      selectedLanguage === lang.code
                        ? 'rgba(255, 153, 51, 0.08)'
                        : 'white',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Text style={{fontSize: 18}}>{lang.flag}</Text>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color:
                            selectedLanguage === lang.code
                              ? '#FF6B35'
                              : '#111827',
                        }}>
                        {lang.nativeName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: '#6B7280',
                          fontWeight: '500',
                        }}>
                        {lang.name}
                      </Text>
                    </View>
                    {selectedLanguage === lang.code && (
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#FF6B35',
                          fontWeight: '700',
                        }}>
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Continue Button */}
        {selectedLanguage && (
          <TouchableOpacity
            onPress={() => handleLanguageSelect(selectedLanguage)}
            activeOpacity={0.9}
            style={{
              marginTop: 32,
              borderRadius: 16,
              overflow: 'hidden',
              width: '100%',
              shadowColor: '#000',
              shadowOpacity: 0.4,
              shadowOffset: {width: 0, height: 5},
              shadowRadius: 10,
              elevation: 8,
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <LinearGradient 
              colors={['#FF6B35', '#FF8C42', '#FF9933']} 
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '800',
                letterSpacing: 1,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: {width: 0, height: 1},
                textShadowRadius: 2
              }}>
                Continue
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold'
              }}>
                →
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={{
          marginTop: 40,
          alignItems: 'center'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)'
          }}>
            <Text style={{fontSize: 20, color: 'white'}}>🛕</Text>
            <Text style={{fontSize: 24, color: 'white'}}>🛕</Text>
            <Text style={{fontSize: 28, color: 'white'}}>🛕</Text>
            <Text style={{fontSize: 24, color: 'white'}}>🛕</Text>
            <Text style={{fontSize: 20, color: 'white'}}>🛕</Text>
          </View>
          <Text style={{
            fontSize: 12,
            color: 'white',
            opacity: 0.9,
            fontWeight: '700',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 2,
            letterSpacing: 0.5
          }}>
            महाकुम्भ नासिक 2027
          </Text>
          <Text style={{
            fontSize: 10,
            color: 'white',
            opacity: 0.7,
            fontWeight: '500',
            marginTop: 4
          }}>
            Kumbh Mela Nashik 2027
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

