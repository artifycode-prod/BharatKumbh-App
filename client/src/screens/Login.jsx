import React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { register, signIn } from '../services/authService';

const ROLE_ICONS = { admin: '🛡️', volunteer: '🤝', medical: '🏥', pilgrim: '👤' };

export const Login = ({goHome}) => {
  const [identifier, setIdentifier] = React.useState(''); // email or phone
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(true);
  const [touched, setTouched] = React.useState({ id: false, pw: false });
  const [mode, setMode] = React.useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = React.useState('pilgrim');
  const [loading, setLoading] = React.useState(false);
  const { t } = useLanguage();

  // Signup: only pilgrim. Login: all roles (admin/volunteer/medical are pre-seeded in DB)
  const roles = mode === 'signup'
    ? [{ id: 'pilgrim', labelKey: 'pilgrim' }]
    : [
        { id: 'admin', labelKey: 'admin' },
        { id: 'volunteer', labelKey: 'volunteer' },
        { id: 'medical', labelKey: 'medicalTeam' },
        { id: 'pilgrim', labelKey: 'pilgrim' }
      ];
  
  const canSubmit = React.useMemo(() => {
    if (loading) return false;
    if (mode === 'login') return identifier.trim().length > 0 && password.length >= 4;
    // signup
    return (
      name.trim().length > 0 &&
      identifier.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.length >= 6
    );
  }, [loading, mode, name, identifier, phone, password]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const idOrEmail = (identifier || '').trim();

      if (mode === 'signup') {
        const email = idOrEmail.includes('@') ? idOrEmail.toLowerCase() : `${idOrEmail}@kumbh.com`;
        await register({ name: name.trim(), email, phone: phone.trim(), password: password, role: 'pilgrim' });
        Alert.alert(t('success'), t('accountCreatedSuccess'));
        goHome();
        return;
      }

      // Login: accepts email or user id + password
      const { role } = await signIn(idOrEmail, password, selectedRole);
      goHome(role);
    } catch (e) {
      Alert.alert(mode === 'signup' ? t('signUpFailed') : t('signInFailed'), e?.message || t('pleaseTryAgain'));
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
              paddingBottom: 80,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{alignItems: 'center', paddingVertical: 16}}>
              <Text style={{fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 4}}>
                Bharat Kumbh
              </Text>
              <Text style={{fontSize: 11, color: 'rgba(255,255,255,0.9)'}}>
                {t('nashik2027')}
              </Text>
            </View>

            {/* Role Selection - Login: all roles | Signup: pilgrim only (pre-selected) */}
            <View style={{paddingHorizontal: 12, marginTop: 8, marginBottom: 20}}>
              <Text style={{fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 10, textAlign: 'center'}}>
                {mode === 'signup' ? t('registerAsPilgrim') : t('selectYourRole')}
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', gap: 8}}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    onPress={() => mode === 'login' && setSelectedRole(role.id)}
                    activeOpacity={0.7}
                    style={{
                      alignItems: 'center',
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      backgroundColor: selectedRole === role.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                      borderWidth: selectedRole === role.id ? 0 : 1,
                      borderColor: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <Text style={{fontSize: 28}}>{ROLE_ICONS[role.id] || '👤'}</Text>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: selectedRole === role.id ? '#FF6B35' : 'white',
                      marginTop: 4,
                      textAlign: 'center'
                    }}>
                      {t(role.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form Card */}
            <View style={{
              marginHorizontal: 16,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.97)',
              paddingHorizontal: 18,
              paddingVertical: 18,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowOffset: {width: 0, height: 4},
              shadowRadius: 10,
              elevation: 8,
            }}>
              {/* Card Header */}
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#7C2D12',
                textAlign: 'center',
                marginBottom: 16,
              }}>
                {mode === 'login' ? t('login') : t('createAccount')}
              </Text>

              {/* Signup Fields - Name & Phone */}
              {mode === 'signup' && (
                <>
                  {/* Name Field */}
                  <View style={{marginBottom: 12}}>
                    <Text style={{fontSize: 11, fontWeight: '600', color: '#7C2D12', marginBottom: 6}}>
                      {t('fullName')}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FFF7ED',
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: name.trim() ? 'rgba(251,146,60,0.3)' : 'rgba(239,68,68,0.15)',
                    }}>
                      <Text style={{fontSize: 18}}>👤</Text>
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder={t('enterFullName')}
                        placeholderTextColor="#9CA3AF"
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: '#1F2937',
                          paddingVertical: 0,
                          marginLeft: 10,
                          fontWeight: '500',
                        }}
                      />
                    </View>
                  </View>

                  {/* Phone Field */}
                  <View style={{marginBottom: 12}}>
                    <Text style={{fontSize: 11, fontWeight: '600', color: '#7C2D12', marginBottom: 6}}>
                      {t('phoneNumber')}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FFF7ED',
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: phone.trim() ? 'rgba(251,146,60,0.3)' : 'rgba(239,68,68,0.15)',
                    }}>
                      <Text style={{fontSize: 18}}>📱</Text>
                      <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={t('enterPhone')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        maxLength={10}
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: '#1F2937',
                          paddingVertical: 0,
                          marginLeft: 10,
                          fontWeight: '500',
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Email Field */}
              <View style={{marginBottom: 12}}>
                <Text style={{fontSize: 11, fontWeight: '600', color: '#7C2D12', marginBottom: 6}}>
                  {t('emailUsername')}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFF7ED',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: touched.id && identifier.trim().length === 0 ? '#EF4444' : 'rgba(251,146,60,0.3)',
                }}>
                  <Text style={{fontSize: 18}}>✉️</Text>
                  <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    onBlur={() => setTouched((t) => ({...t, id: true}))}
                    placeholder={mode === 'login' ? 'email or user id' : t('enterEmail')}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: '#1F2937',
                      paddingVertical: 0,
                      marginLeft: 10,
                      fontWeight: '500',
                    }}
                  />
                </View>
                {touched.id && identifier.trim().length === 0 && (
                  <Text style={{color: '#EF4444', fontSize: 10, marginTop: 4, fontWeight: '500'}}>
                    {t('required')}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View style={{marginBottom: 14}}>
                <Text style={{fontSize: 11, fontWeight: '600', color: '#7C2D12', marginBottom: 6}}>
                  {t('password')}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFF7ED',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: touched.pw && password.length < (mode === 'login' ? 4 : 6) ? '#EF4444' : 'rgba(251,146,60,0.3)',
                }}>
                  <Text style={{fontSize: 18}}>🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setTouched((t) => ({...t, pw: true}))}
                    placeholder={mode === 'login' ? t('enterPassword') : t('minChars')}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={secure}
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: '#1F2937',
                      paddingVertical: 0,
                      marginLeft: 10,
                      fontWeight: '500',
                    }}
                  />
                    <TouchableOpacity onPress={() => setSecure(!secure)} style={{padding: 4}}>
                    <Text style={{fontSize: 18}}>{secure ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
                {touched.pw && password.length < (mode === 'login' ? 4 : 6) && (
                  <Text style={{color: '#EF4444', fontSize: 10, marginTop: 4, fontWeight: '500'}}>
                    {mode === 'login' ? t('min4Characters') : t('min6Characters')}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                disabled={!canSubmit} 
                onPress={onLogin} 
                activeOpacity={0.85}
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginTop: 8,
                  shadowColor: canSubmit ? '#FF6B35' : '#000',
                  shadowOpacity: canSubmit ? 0.25 : 0.08,
                  shadowOffset: {width: 0, height: 3},
                  shadowRadius: 6,
                  elevation: canSubmit ? 5 : 2,
                }}
              >
                <LinearGradient 
                  colors={canSubmit ? ['#FF6B35', '#FF8C42'] : ['#D1D5DB', '#9CA3AF']} 
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={{
                      color: 'white',
                      fontSize: 15,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                    }}>
                      {mode === 'login' ? t('login').toUpperCase() : t('signUp')}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Continue as Guest */}
              <TouchableOpacity onPress={goHome} style={{marginTop: 12}}>
                <Text style={{
                  color: '#9A3412',
                  fontSize: 12,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {t('continueAsGuest')}
                </Text>
              </TouchableOpacity>

              {/* Toggle Login/Signup */}
              <TouchableOpacity 
                onPress={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setTouched({id: false, pw: false});
                }}
                style={{marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)'}}
              >
                <Text style={{
                  color: '#7C2D12',
                  fontSize: 12,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ...no demo login info, production UI only... */}
            {/* Welcome/Info Content Below Card */}
            <View style={{marginHorizontal: 24, marginTop: 28, alignItems: 'center'}}>
              <Text style={{fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 6, textAlign: 'center', textShadowColor: 'rgba(255,255,255,0.7)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>
                {t('welcomeBharatKumbh')}
              </Text>
              <Text style={{fontSize: 12, color: '#000000', textAlign: 'center', lineHeight: 18, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 2}}>
                {t('loginOrSignupMessage')}
              </Text>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

