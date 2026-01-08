import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentUser, signOut } from '../services/authService';
import { styles } from '../styles/styles';

const USER_KEY = 'user_data';

export const Profile = ({goHome, onSignOut, navigation}) => {
  const { t } = useLanguage();
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  // Reload when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadUserInfo();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      
      // Method 1: Try to get from user_data (stored as JSON during login)
      const userDataString = await AsyncStorage.getItem(USER_KEY);
      if (userDataString) {
        try {
          const user = JSON.parse(userDataString);
          console.log('✅ Found user_data:', user);
          if (user && (user.name || user.email || user.phone || user.role)) {
            setUserName(user.name || user.email || user.phone || 'User');
            setUserRole(user.role || 'user');
            setUserEmail(user.email || user.phone || '');
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log('❌ Error parsing user_data:', e);
        }
      }
      
      // Method 2: Try individual keys (stored separately during login)
      const [name, role] = await Promise.all([
        AsyncStorage.getItem('user_name'),
        AsyncStorage.getItem('user_role')
      ]);
      
      console.log('📦 AsyncStorage keys - name:', name, 'role:', role);
      
      if (name || role) {
        setUserName(name || 'User');
        setUserRole(role || 'user');
        setUserEmail(name || '');
        setLoading(false);
        return;
      }
      
      // Method 3: Try API as last resort
      try {
        const user = await getCurrentUser();
        console.log('🌐 API user:', user);
        if (user) {
          const finalName = user.name || user.email || user.phone || 'User';
          const finalRole = user.role || 'user';
          const finalEmail = user.email || user.phone || '';
          
          setUserName(finalName);
          setUserRole(finalRole);
          setUserEmail(finalEmail);
          
          // Save to AsyncStorage for next time
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
          if (user.name) await AsyncStorage.setItem('user_name', user.name);
          if (user.role) await AsyncStorage.setItem('user_role', user.role);
        } else {
          setUserName('User');
          setUserRole('user');
          setUserEmail('');
        }
      } catch (apiError) {
        console.log('❌ API error:', apiError.message);
        setUserName('User');
        setUserRole('user');
        setUserEmail('');
      }
    } catch (error) {
      console.error('❌ Profile load error:', error);
      setUserName('User');
      setUserRole('user');
      setUserEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('signOut'),
      t('signOutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              if (onSignOut) {
                onSignOut();
              } else {
                // If no onSignOut callback, navigate to login
                // This will be handled by the navigation wrapper
              }
            } catch (error) {
              Alert.alert(t('error'), t('somethingWentWrong'));
            }
          }
        }
      ]
    );
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      pilgrim: t('pilgrim'),
      volunteer: t('volunteer'),
      admin: t('admin'),
      medical: t('medicalTeam')
    };
    return roleLabels[role] || t('user');
  };

  const getRoleEmoji = (role) => {
    const roleEmojis = {
      pilgrim: '🪔',
      volunteer: '🤝',
      admin: '🔱',
      medical: '🚑'
    };
    return roleEmojis[role] || '👤';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      pilgrim: ['#FFB74D', '#FF9800'],
      volunteer: ['#34D399', '#10B981'],
      admin: ['#60A5FA', '#3B82F6'],
      medical: ['#F87171', '#EF4444']
    };
    return roleColors[role] || ['#FFB74D', '#FF9800'];
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.screenPad}>
        <Header title={t('profile')} icon="👤" onBack={goHome} />
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>{t('loading')}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title={t('profile')} icon="👤" onBack={goHome} />
      
      <View style={styles.cardCenter}>
        <LinearGradient colors={getRoleColor(userRole)} style={[styles.round64, {shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: {width: 0, height: 8}, shadowRadius: 16, elevation: 6}]}>
          <Text style={styles.round64Text}>{getRoleEmoji(userRole)}</Text>
        </LinearGradient>
        <Text style={[styles.authTitle, {marginTop: 12}]}>{userName || t('user')}</Text>
        <Text style={styles.smallMutedCenter}>{getRoleLabel(userRole || 'user')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('profile')} {t('details')}</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>{t('name')}:</Text>
          <Text style={styles.kvValueDark}>{userName || t('notSet')}</Text>
        </View>
        {userEmail && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>{t('emailPhone')}:</Text>
            <Text style={styles.kvValueDark}>{userEmail}</Text>
          </View>
        )}
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>{t('role')}:</Text>
          <Text style={styles.kvValueDark}>{getRoleLabel(userRole)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('profile')} {t('settings')}</Text>
        <TouchableOpacity
          style={[styles.primaryBtn, {backgroundColor: '#DC2626', marginTop: 8}]}
          onPress={handleSignOut}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryBtnText}>{t('signOut')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

