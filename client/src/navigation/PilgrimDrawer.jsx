import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AboutUs } from '../screens/AboutUs';
import { Chatbot } from '../screens/Chatbot';
import { Home } from '../screens/Home';
import { Lost } from '../screens/Lost';
import { Medical } from '../screens/Medical';
import { Navigation } from '../screens/Navigation';
import { Profile } from '../screens/Profile';
import { SOS } from '../screens/SOS';
import { QR } from '../screens/QR';
import { CustomDrawerContent } from '../components/CustomDrawerContent';
import { PilgrimWithBottomNav } from './PilgrimWithBottomNav';

const Drawer = createDrawerNavigator();

const drawerIcon = (name, focused) => (
  <Icon
    name={
      {
        Home: 'home',
        Navigation: 'map-marker-path',
        Medical: 'medical-bag',
        Profile: 'account-circle',
        SOS: 'alert-circle',
        Chatbot: 'chat-processing',
        QR: 'qrcode-scan',
        Lost: 'account-search',
        'About Us': 'information',
      }[name] || 'circle'
    }
    size={24}
    color={focused ? '#7C2D12' : '#9A3412'}
  />
);

const withPilgrimScreen = (Component, options = {}) => ({ navigation, ...props }) => {
  const { useGoHome = false, isProfile = false } = options;
  const go = (screen, params) => navigation.navigate(screen, params);
  const goHome = () => navigation.navigate('Home');

  const onSignOut = async () => {
    const { signOut } = require('../services/authService');
    await signOut();
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  let content;
  if (useGoHome) {
    content = <Component {...props} goHome={goHome} />;
  } else if (isProfile) {
    content = <Component {...props} goHome={goHome} onSignOut={onSignOut} navigation={navigation} />;
  } else {
    content = <Component {...props} go={go} />;
  }

  return (
    <PilgrimWithBottomNav navigation={navigation}>
      {content}
    </PilgrimWithBottomNav>
  );
};

export function PilgrimDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 280,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          overflow: 'hidden',
        },
        drawerType: 'front',
        drawerActiveTintColor: '#7C2D12',
        drawerInactiveTintColor: '#9A3412',
        drawerActiveBackgroundColor: 'rgba(255,255,255,0.6)',
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: { fontWeight: '600', fontSize: 15 },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 8, marginVertical: 2 },
        headerStyle: {
          backgroundColor: '#FF9933',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        drawerIcon: ({ focused }) => drawerIcon(route.name, focused),
      })}
    >
      <Drawer.Screen name="Home" component={withPilgrimScreen(Home)} />
      <Drawer.Screen name="Navigation" component={withPilgrimScreen(Navigation, { useGoHome: true })} />
      <Drawer.Screen name="Medical" component={withPilgrimScreen(Medical, { useGoHome: true })} />
      <Drawer.Screen name="Profile" component={withPilgrimScreen(Profile, { isProfile: true })} />
      <Drawer.Screen name="SOS" component={withPilgrimScreen(SOS)} />
      <Drawer.Screen name="Chatbot" component={withPilgrimScreen(Chatbot, { useGoHome: true })} options={{ title: 'Assistant' }} />
      <Drawer.Screen name="QR" component={withPilgrimScreen(QR, { useGoHome: true })} options={{ title: 'QR Check-in' }} />
      <Drawer.Screen name="Lost" component={withPilgrimScreen(Lost, { useGoHome: true })} options={{ title: 'Lost & Found' }} />
      <Drawer.Screen name="About Us" component={withPilgrimScreen(AboutUs)} />
    </Drawer.Navigator>
  );
}
