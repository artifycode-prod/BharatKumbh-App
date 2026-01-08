import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { AdminBottomNav } from '../components/AdminBottomNav';
import { BottomNav } from '../components/BottomNav';
import { MedicalBottomNav } from '../components/MedicalBottomNav';
import { VolunteerBottomNav } from '../components/VolunteerBottomNav';
import { AttractionDetail } from '../screens/AttractionDetail';
import { Chatbot } from '../screens/Chatbot';
import { Dashboard } from '../screens/Dashboard';
import { Home } from '../screens/Home';
import { LanguageSelection } from '../screens/LanguageSelection';
import { Login } from '../screens/Login';
import { Lost } from '../screens/Lost';
import { LostFoundDetails } from '../screens/LostFoundDetails';
import { Medical } from '../screens/Medical';
import { Navigation as NavigationScreen } from '../screens/Navigation';
import { Profile } from '../screens/Profile';
import { QR } from '../screens/QR';
import { SOS } from '../screens/SOS';
import { Splash } from '../screens/Splash';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { AdminEmergency } from '../screens/admin/AdminEmergency';
import { AdminLostFound } from '../screens/admin/AdminLostFound';
import { AdminRegistrations } from '../screens/admin/AdminRegistrations';
import { AdminReports } from '../screens/admin/AdminReports';
import { AdminVolunteers } from '../screens/admin/AdminVolunteers';
import { EmergencyDetails } from '../screens/admin/EmergencyDetails';
import { RegistrationDetails } from '../screens/admin/RegistrationDetails';
import { MedicalCamp } from '../screens/medical/MedicalCamp';
import { MedicalCaseDetail } from '../screens/medical/MedicalCaseDetail';
import { MedicalCases } from '../screens/medical/MedicalCases';
import { MedicalDashboard } from '../screens/medical/MedicalDashboard';
import { MedicalInventory } from '../screens/medical/MedicalInventory';
import { MedicalRequests } from '../screens/medical/MedicalRequests';
import { VolunteerCommunication } from '../screens/volunteer/VolunteerCommunication';
import { VolunteerDashboard } from '../screens/volunteer/VolunteerDashboard';
import { VolunteerLostFound } from '../screens/volunteer/VolunteerLostFound';
import { VolunteerSOS } from '../screens/volunteer/VolunteerSOS';
import { VolunteerTasks } from '../screens/volunteer/VolunteerTasks';
import { getToken, getUserRole, signOut } from '../services/authService';
import { clearLanguage, getLanguage, hasLanguageSelected } from '../services/languageService';
import { styles } from '../styles/styles';

const Stack = createStackNavigator();

const withBottomNav = (routeName, render) => {
  return ({navigation}) => (
    <View style={styles.container}>
      {render(() => navigation.navigate('Home'), navigation)}
      <BottomNav
        active={routeName}
        onChange={(next) => {
          const map = {
            splash: 'Splash',
            home: 'Home',
            navigation: 'Navigation',
            medical: 'Medical',
            sos: 'SOS',
            chatbot: 'Chatbot',
            qr: 'QR',
            lost: 'Lost',
            dashboard: 'Dashboard',
          };
          navigation.navigate(map[next]);
        }}
      />
    </View>
  );
};

const withVolunteerNav = (routeName, render) => {
  return ({navigation}) => (
    <View style={styles.container}>
      {render(() => navigation.navigate('VolunteerDashboard'), navigation)}
      <VolunteerBottomNav
        active={routeName}
        onChange={(next) => {
          const map = {
            dashboard: 'VolunteerDashboard',
            tasks: 'VolunteerTasks',
            lostfound: 'VolunteerLostFound',
            sos: 'VolunteerSOS',
            communication: 'VolunteerCommunication',
          };
          navigation.navigate(map[next]);
        }}
      />
    </View>
  );
};

const withAdminNav = (routeName, render) => {
  return ({navigation}) => (
    <View style={styles.container}>
      {render(() => navigation.navigate('AdminDashboard'), navigation)}
      <AdminBottomNav
        active={routeName}
        onChange={(next) => {
          const map = {
            dashboard: 'AdminDashboard',
            volunteers: 'AdminVolunteers',
            registrations: 'AdminRegistrations',
            emergency: 'AdminEmergency',
          };
          navigation.navigate(map[next]);
        }}
      />
    </View>
  );
};

const withMedicalNav = (routeName, render) => {
  return ({navigation}) => (
    <View style={styles.container}>
      {render(() => navigation.navigate('MedicalDashboard'), navigation)}
      <MedicalBottomNav
        active={routeName}
        onChange={(next) => {
          const map = {
            dashboard: 'MedicalDashboard',
            cases: 'MedicalCases',
            camp: 'MedicalCamp',
            inventory: 'MedicalInventory',
          };
          navigation.navigate(map[next]);
        }}
      />
    </View>
  );
};

const SplashWrapper = ({navigation}) => {
  const handleGetStarted = React.useCallback(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    try {
      // TEMPORARY: Set to true to ALWAYS show language selection (for testing)
      // Set to false to use normal flow (check if language exists)
      const FORCE_LANGUAGE_SELECTION = true; // CHANGE THIS TO false AFTER TESTING
      
      // Debug: Check all AsyncStorage keys
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const allKeys = await AsyncStorage.getAllKeys();
        const allItems = await AsyncStorage.multiGet(allKeys);
        console.log('📦 All AsyncStorage items:', allItems);
      } catch (e) {
        console.log('Could not read all AsyncStorage keys');
      }
      
      // Check if language has been selected (with retry for reliability)
      let languageSelected = false;
      let storedLanguage = null;
      
      // Try checking language up to 3 times
      for (let i = 0; i < 3; i++) {
        languageSelected = await hasLanguageSelected();
        storedLanguage = await getLanguage();
        
        if (languageSelected && storedLanguage) {
          break; // Found valid language, exit loop
        }
        
        if (i < 2) {
          // Wait a bit before retrying (in case AsyncStorage is still writing)
          await sleep(200);
        }
      }
      
      // Enhanced debugging
      console.log('═══════════════════════════════════════');
      console.log('🔍 SPLASH SCREEN - Language Check');
      console.log('═══════════════════════════════════════');
      console.log('Language Selected:', languageSelected);
      console.log('Stored Language:', storedLanguage);
      console.log('FORCE MODE:', FORCE_LANGUAGE_SELECTION);
      console.log('Will show LanguageSelection:', !languageSelected || FORCE_LANGUAGE_SELECTION);
      console.log('═══════════════════════════════════════');
      
      // If no language selected OR force mode, go to language selection FIRST
      if (!languageSelected || FORCE_LANGUAGE_SELECTION) {
        if (FORCE_LANGUAGE_SELECTION) {
          console.log('🔧 FORCE MODE: Clearing language and showing selection');
          await clearLanguage();
          // Double check it's cleared
          const afterClear = await hasLanguageSelected();
          console.log('🔍 After clear check:', afterClear);
        }
        console.log('✅✅✅ NAVIGATING TO LANGUAGE SELECTION ✅✅✅');
        navigation.replace('LanguageSelection');
        return;
      }
      
      console.log('✅ Language found:', storedLanguage);
      console.log('✅ Skipping LanguageSelection, proceeding to Login/Home');
      
      // Language is selected, check authentication
      const [token, role] = await Promise.all([
        getToken(), 
        getUserRole()
      ]);
      
      if (token && role) {
        // User is logged in, go to their dashboard
        const roleMap = {
          pilgrim: 'Home',
          volunteer: 'VolunteerDashboard',
          admin: 'AdminDashboard',
          medical: 'MedicalDashboard',
        };
        console.log('✅ User logged in as', role, '- Going to', roleMap[role]);
        navigation.replace(roleMap[role]);
      } else {
        // User not logged in, go to login
        console.log('✅ User not logged in - Going to Login');
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('❌ Splash navigation error:', error);
      // On any error, default to language selection (safest option)
      console.log('⚠️ Error occurred - Defaulting to LanguageSelection');
      navigation.replace('LanguageSelection');
    }
  }, [navigation]);

  return <Splash onGetStarted={handleGetStarted} />;
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashWrapper} />
        <Stack.Screen name="LanguageSelection" component={({navigation}) => (
          <View style={styles.container}>
            <LanguageSelection onLanguageSelected={() => navigation.replace('Login')} />
          </View>
        )} />
        <Stack.Screen name="Login" component={({navigation}) => (
          <View style={styles.container}>
            <Login goHome={() => {
              // Check role and navigate accordingly
              getUserRole().then((role) => {
                const roleMap = {
                  pilgrim: 'Home',
                  volunteer: 'VolunteerDashboard',
                  admin: 'AdminDashboard',
                  medical: 'MedicalDashboard',
                };
                navigation.replace(roleMap[role || 'pilgrim']);
              });
            }} />
          </View>
        )} />

        {/* Pilgrim Screens */}
        <Stack.Screen name="Home" component={({navigation}) => (
          withBottomNav('home', (goHome) => (
            <Home
              go={(p, params) => {
                if (!p) {
                  console.warn('Navigation: No route provided');
                  return;
                }
                const routeMap = {
                  'navigation': 'Navigation',
                  'medical': 'Medical',
                  'qr': 'QR',
                  'lost': 'Lost',
                  'dashboard': 'Dashboard',
                  'AttractionDetail': 'AttractionDetail',
                };
                const route = routeMap[p] || p; // Fallback to p itself if not in map
                try {
                  if (params) {
                    navigation.navigate(route, params);
                  } else {
                    navigation.navigate(route);
                  }
                } catch (error) {
                  console.error('Navigation error:', error, 'Route:', route, 'Params:', params);
                }
              }}
              onProfile={() => navigation.navigate('Profile')}
              onSignOut={async () => {
                await signOut();
                navigation.replace('Login');
              }}
            />
          ))({navigation})
        )} />
        <Stack.Screen name="Profile" component={({navigation}) => (
          withBottomNav('home', (goHome) => (
            <Profile 
              goHome={goHome}
              navigation={navigation}
              onSignOut={async () => {
                await signOut();
                navigation.replace('Login');
              }}
            />
          ))({navigation})
        )} />
        <Stack.Screen name="Navigation" component={withBottomNav('navigation', (goHome) => <NavigationScreen goHome={goHome} />)} />
        <Stack.Screen name="Medical" component={withBottomNav('medical', (goHome) => <Medical goHome={goHome} />)} />
        <Stack.Screen name="SOS" component={withBottomNav('sos', (goHome) => <SOS goHome={goHome} />)} />
        <Stack.Screen name="Chatbot" component={withBottomNav('chatbot', (goHome) => <Chatbot goHome={goHome} />)} />
        <Stack.Screen name="QR" component={withBottomNav('qr', (goHome) => <QR goHome={goHome} />)} />
        <Stack.Screen name="Lost" component={withBottomNav('lost', (goHome, navigation) => <Lost goHome={goHome} navigation={navigation} />)} />
        <Stack.Screen name="Dashboard" component={withBottomNav('dashboard', (goHome) => <Dashboard goHome={goHome} />)} />
        
        {/* Details Screens - No bottom nav */}
        <Stack.Screen name="AttractionDetail" component={({navigation, route}) => (
          <View style={styles.container}>
            <AttractionDetail navigation={navigation} route={route} />
          </View>
        )} />
        <Stack.Screen name="LostFoundDetails" component={({navigation, route}) => (
          <View style={styles.container}>
            <LostFoundDetails navigation={navigation} route={route} />
          </View>
        )} />

        {/* Volunteer Screens */}
        <Stack.Screen name="VolunteerDashboard" component={withVolunteerNav('dashboard', (goHome, navigation) => (
          <VolunteerDashboard 
            goHome={goHome} 
            navigate={(screen) => {
              const map = {
                Tasks: 'VolunteerTasks',
                LostFound: 'VolunteerLostFound',
                SOS: 'VolunteerSOS',
                Communication: 'VolunteerCommunication',
              };
              navigation.navigate(map[screen] || 'VolunteerDashboard');
            }}
            onProfile={() => navigation.navigate('VolunteerProfile')}
            onSignOut={async () => {
              try {
                await signOut();
                navigation.replace('Login');
              } catch (error) {
                console.error('Logout error:', error);
                navigation.replace('Login');
              }
            }}
          />
        ))} />
        <Stack.Screen name="VolunteerProfile" component={withVolunteerNav('dashboard', (goHome, navigation) => (
          <Profile 
            goHome={goHome}
            onSignOut={async () => {
              await signOut();
              navigation.replace('Login');
            }}
          />
        ))} />
        <Stack.Screen name="VolunteerTasks" component={withVolunteerNav('tasks', (goHome) => <VolunteerTasks goHome={goHome} />)} />
        <Stack.Screen name="VolunteerLostFound" component={withVolunteerNav('lostfound', (goHome) => <VolunteerLostFound goHome={goHome} />)} />
        <Stack.Screen name="VolunteerSOS" component={withVolunteerNav('sos', (goHome) => <VolunteerSOS goHome={goHome} />)} />
        <Stack.Screen name="VolunteerCommunication" component={withVolunteerNav('communication', (goHome) => <VolunteerCommunication goHome={goHome} />)} />

        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={withAdminNav('dashboard', (goHome, navigation) => (
          <AdminDashboard 
            goHome={goHome} 
            navigate={(screen) => {
              const map = {
                Registrations: 'AdminRegistrations',
                LostFound: 'AdminLostFound',
                MedicalEmergencies: 'AdminEmergency',
              };
              navigation.navigate(map[screen] || 'AdminDashboard');
            }}
            onProfile={() => navigation.navigate('AdminProfile')}
            onSignOut={async () => {
              await signOut();
              navigation.replace('Login');
            }}
          />
        ))} />
        <Stack.Screen name="AdminVolunteers" component={withAdminNav('volunteers', (goHome) => <AdminVolunteers goHome={goHome} />)} />
        <Stack.Screen name="AdminRegistrations" component={withAdminNav('registrations', (goHome, navigation) => <AdminRegistrations goHome={goHome} navigation={navigation} />)} />
        <Stack.Screen name="RegistrationDetails" component={({navigation, route}) => (
          <View style={styles.container}>
            <RegistrationDetails navigation={navigation} route={route} />
          </View>
        )} />
        <Stack.Screen name="AdminProfile" component={withAdminNav('dashboard', (goHome, navigation) => (
          <Profile 
            goHome={goHome}
            onSignOut={async () => {
              await signOut();
              navigation.replace('Login');
            }}
          />
        ))} />
        <Stack.Screen name="AdminLostFound" component={withAdminNav('lostfound', (goHome, navigation) => <AdminLostFound goHome={goHome} navigation={navigation} />)} />
        <Stack.Screen name="AdminEmergency" component={withAdminNav('emergency', (goHome, navigation) => <AdminEmergency goHome={goHome} navigation={navigation} />)} />
        <Stack.Screen name="EmergencyDetails" component={({navigation, route}) => (
          <View style={styles.container}>
            <EmergencyDetails navigation={navigation} route={route} />
          </View>
        )} />
        <Stack.Screen name="AdminReports" component={withAdminNav('reports', (goHome) => <AdminReports goHome={goHome} />)} />

        {/* Medical Team Screens */}
        <Stack.Screen name="MedicalDashboard" component={withMedicalNav('dashboard', (goHome, navigation) => (
          <MedicalDashboard 
            goHome={goHome} 
            navigate={(screen, params) => {
              const map = {
                Cases: 'MedicalCases',
                Camp: 'MedicalCamp',
                Inventory: 'MedicalInventory',
                MedicalCaseDetail: 'MedicalCaseDetail',
              };
              const screenName = map[screen] || screen;
              if (params) {
                navigation.navigate(screenName, params);
              } else {
                navigation.navigate(screenName);
              }
            }}
            onProfile={() => navigation.navigate('MedicalProfile')}
            onSignOut={async () => {
              try {
                await signOut();
                navigation.replace('Login');
              } catch (error) {
                console.error('Logout error:', error);
                // Still try to navigate to login even if signOut fails
                navigation.replace('Login');
              }
            }}
          />
        ))} />
        <Stack.Screen name="MedicalProfile" component={withMedicalNav('dashboard', (goHome, navigation) => (
          <Profile 
            goHome={goHome}
            onSignOut={async () => {
              await signOut();
              navigation.replace('Login');
            }}
          />
        ))} />
        <Stack.Screen name="MedicalRequests" component={withMedicalNav('requests', (goHome) => <MedicalRequests goHome={goHome} />)} />
        <Stack.Screen name="MedicalCases" component={withMedicalNav('cases', (goHome) => <MedicalCases goHome={goHome} />)} />
        <Stack.Screen name="MedicalCaseDetail" component={({navigation, route}) => (
          <View style={styles.container}>
            <MedicalCaseDetail navigation={navigation} route={route} />
          </View>
        )} />
        <Stack.Screen name="MedicalCamp" component={withMedicalNav('camp', (goHome) => <MedicalCamp goHome={goHome} />)} />
        <Stack.Screen name="MedicalInventory" component={withMedicalNav('inventory', (goHome) => <MedicalInventory goHome={goHome} />)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

