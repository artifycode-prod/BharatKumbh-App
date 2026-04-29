import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

// Map Drawer route names to BottomNav active tab ids
const ROUTE_TO_TAB = {
  Home: 'home',
  Navigation: 'navigation',
  Medical: 'medical',
  SOS: 'sos',
  Chatbot: 'chatbot',
  Profile: 'home', // Profile not in bottom nav, default to home
  QR: 'home',
  Lost: 'home',
  'About Us': 'home',
};

export function PilgrimWithBottomNav({ children, navigation }) {
  const route = useRoute();
  const activeTab = ROUTE_TO_TAB[route?.name] || 'home';

  const handleTabChange = (next) => {
    const map = {
      home: 'Home',
      navigation: 'Navigation',
      medical: 'Medical',
      sos: 'SOS',
      profile: 'Profile',
      chatbot: 'Chatbot',
    };
    if (navigation && map[next]) {
      navigation.navigate(map[next]);
    }
  };

  return (
    <View style={styles.container}>
      {children}
      <BottomNav active={activeTab} onChange={handleTabChange} />
    </View>
  );
}
