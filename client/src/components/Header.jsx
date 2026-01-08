import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { styles } from '../styles/styles';

export const Header = ({title, icon, accent, onBack}) => {
  const { t } = useLanguage();
  // Common translation keys that might be used as titles
  const translationKeys = ['navigation', 'medical', 'lostFound', 'qrCheckin', 'sos', 'profile', 'home', 'chatbot'];
  // If title is a translation key, translate it; otherwise use as-is
  const displayTitle = title && translationKeys.includes(title) ? t(title) : title;
  
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={[styles.headerBtnEmoji, accent === 'red' ? styles.textRed : styles.textOrange]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, accent === 'red' ? styles.textRedStrong : styles.textOrangeStrong]}>{displayTitle}</Text>
        <LinearGradient colors={['#FF9933', '#FFD700']} style={styles.headerBadge}>
          <Text style={styles.headerBadgeEmoji}>{icon ?? '🔱'}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

