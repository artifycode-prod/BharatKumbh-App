import React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { signIn } from '../services/authService';

export const Login = ({goHome}) => {
  const [identifier, setIdentifier] = React.useState(''); // email or phone
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(true);
  const [touched, setTouched] = React.useState({ id: false, pw: false });
  const [loading, setLoading] = React.useState(false);
  const { t } = useLanguage();
  
  const canSubmit = !loading && identifier.trim().length > 0 && password.length >= 4;

  const onLogin = async () => {
    try {
      setLoading(true);
      // Role will be determined by the backend based on credentials
      await signIn(identifier, password, null);
      goHome();
    } catch (e) {
      Alert.alert('Sign in failed', e?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{flex: 1}}
    >
      <LinearGradient
        colors={['#FF9933', '#FF8C42', '#FF6B35']}
        style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: Platform.OS === 'ios' ? 40 : 16,
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Version Number */}
            <View style={{alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 10}}>
              <Text style={{color: 'white', fontSize: 11, opacity: 0.85, fontWeight: '500'}}>Version: 1.0.7</Text>
            </View>

            {/* Top Section - Kumbh Mela Graphic */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 8,
              }}>
              {/* Kumbh Mela Graphic - Enhanced */}
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowOffset: {width: 0, height: 4},
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                <Text style={{fontSize: 32, marginBottom: 2}}>🕉️</Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: '#FF6B35',
                    fontWeight: '700',
                    textAlign: 'center',
                    paddingHorizontal: 6,
                  }}>
                  || सर्वसिद्धिप्रदः कुम्भः ||
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: '#FFE4C4',
                  fontWeight: '600',
                  letterSpacing: 0.5,
                }}>
                महाकुम्भ नासिक 2027
              </Text>
            </View>

            {/* App Title Section - Enhanced */}
            <View
              style={{
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 12,
              }}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '800',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: 4,
                  letterSpacing: 0.5,
                  textShadowColor: 'rgba(0,0,0,0.1)',
                  textShadowOffset: {width: 0, height: 2},
                  textShadowRadius: 4,
                }}>
                {t('kumbhMela')}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.95)',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {t('pleaseEnterCredentials')}
              </Text>
            </View>

            {/* Login Card - Enhanced */}
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 16,
                marginBottom: 24,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.95)',
                paddingHorizontal: 20,
                paddingVertical: 20,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: {width: 0, height: 4},
                shadowRadius: 12,
                elevation: 8,
              }}>
              {/* Card header */}
              <View style={{marginBottom: 16, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#7C2D12',
                    fontWeight: '700',
                    letterSpacing: 0.3,
                  }}>
                  {t('login')}
                </Text>
              </View>

              {/* Login Form */}
              {/* Email or Mobile Input - Enhanced */}
              <Text
                style={{
                  fontSize: 12,
                  color: '#7C2D12',
                  marginBottom: 6,
                  fontWeight: '600',
                }}>
                {t('emailOrMobile')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFF7ED',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: touched.id && identifier.trim().length === 0 ? '#EF4444' : 'rgba(251,146,60,0.2)',
                }}>
                <Text style={{fontSize: 20, marginRight: 10}}>👤</Text>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  onBlur={() => setTouched((t) => ({...t, id: true}))}
                  placeholder={t('emailOrMobile')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: '#1F2937',
                    paddingVertical: 0,
                    fontWeight: '500',
                  }}
                />
              </View>
              {touched.id && identifier.trim().length === 0 ? (
                <Text
                  style={{
                    color: '#EF4444',
                    fontSize: 11,
                    marginTop: 4,
                    paddingLeft: 4,
                    fontWeight: '500',
                  }}>
                  {t('emailOrMobile')} {t('required')}
                </Text>
              ) : null}

              {/* Password Input - Enhanced */}
              <Text
                style={{
                  fontSize: 12,
                  color: '#7C2D12',
                  marginTop: 14,
                  marginBottom: 6,
                  fontWeight: '600',
                }}>
                {t('password')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFF7ED',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: touched.pw && password.length < 4 ? '#EF4444' : 'rgba(251,146,60,0.2)',
                }}>
                <Text style={{fontSize: 20, marginRight: 10}}>🛡️</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched((t) => ({...t, pw: true}))}
                  placeholder={t('password')}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={secure}
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: '#1F2937',
                    paddingVertical: 0,
                    fontWeight: '500',
                  }}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)} style={{padding: 4}}>
                  <Text style={{fontSize: 20}}>{secure ? '👁️‍🗨️' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {touched.pw && password.length < 4 ? (
                <Text
                  style={{
                    color: '#EF4444',
                    fontSize: 11,
                    marginTop: 4,
                    paddingLeft: 4,
                    fontWeight: '500',
                  }}>
                  Minimum 4 characters required
                </Text>
              ) : null}

              {/* Login Button - Enhanced */}
              <TouchableOpacity
                disabled={!canSubmit} 
                onPress={onLogin} 
                activeOpacity={0.85}
                style={{
                  marginTop: 24,
                  borderRadius: 12,
                  overflow: 'hidden',
                  shadowColor: canSubmit ? '#FF6B35' : '#000',
                  shadowOpacity: canSubmit ? 0.3 : 0.1,
                  shadowOffset: {width: 0, height: 4},
                  shadowRadius: 8,
                  elevation: canSubmit ? 6 : 2,
                }}
              >
                <LinearGradient 
                  colors={canSubmit ? ['#FF6B35', '#FF8C42'] : ['#D1D5DB', '#9CA3AF']} 
                  style={{
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '700',
                        letterSpacing: 0.8,
                      }}>
                      {t('login')}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Continue as Guest - Enhanced */}
              <View style={{marginTop: 18, alignItems: 'center'}}>
                <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
                  <Text
                    style={{
                      color: '#9A3412',
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {t('continueAsGuest')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Temple Silhouettes at Bottom - Fixed Position */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 12,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: {width: 0, height: -4},
            shadowRadius: 8,
            elevation: 10,
          }}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 8}}>
              <Text style={{fontSize: 26, opacity: 0.8}}>🛕</Text>
              <Text style={{fontSize: 32, opacity: 0.9}}>🛕</Text>
              <Text style={{fontSize: 38, opacity: 1}}>🛕</Text>
              <Text style={{fontSize: 32, opacity: 0.9}}>🛕</Text>
              <Text style={{fontSize: 26, opacity: 0.8}}>🛕</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

