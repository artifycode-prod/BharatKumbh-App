import React from 'react';
import { View } from 'react-native';
import { Home } from '../screens/Home';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

export function HomeWithBottomNav(props) {
  const { navigation } = props;
  // go function for Home - navigates to Drawer screens or parent Stack screens (AttractionDetail, etc.)
  const go = React.useCallback((screen, params) => {
    if (!navigation) return;
    if (params) {
      navigation.navigate(screen, params);
    } else {
      navigation.navigate(screen);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Home {...props} go={go} />
      <BottomNav active="home" onChange={(next) => {
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
      }} />
    </View>
  );
}