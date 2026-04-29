import React from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { createSOS } from '../services/sosService';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

export const SOS = ({goHome}) => {
  const { t } = useLanguage();
  const [sosActivated, setSosActivated] = React.useState(false);
  const [holding, setHolding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const holdTimerRef = React.useRef(null);

  const sendSOSAlert = async () => {
    setLoading(true);
    try {
      const location = await getCurrentPosition();
      
      try {
        await createSOS({
          latitude: location.latitude,
          longitude: location.longitude,
          message: 'Emergency SOS alert activated',
          priority: 'critical'
        });
        Alert.alert(t('sosAlertSent'), t('emergencyNotified'));
      } catch (error) {
        console.error('SOS Error:', error);
        let errorMessage = t('failedToSendSOS');
        
        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          if (error.response.data?.errors) {
            errorMessage = error.response.data.errors.map(e => e.msg || e.message).join('\n');
          }
        } else if (error.request) {
          // Request made but no response - network/connection error
          const { API_CONFIG } = require('../config/api');
          errorMessage = `${t('cannotConnectServer')}\n\nAPI: ${API_CONFIG.BASE_URL}\n\n• Ensure server is running: cd server && npm run dev\n• Android emulator: use 10.0.2.2:5000\n• Physical device: use your computer IP (e.g. 192.168.1.x:5000)`;
        } else {
          errorMessage = error.message || errorMessage;
        }
        
        Alert.alert(t('error'), errorMessage);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert(t('error'), error.message || t('failedToSendSOS'));
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    setHolding(true);
    holdTimerRef.current = setTimeout(() => {
      setHolding(false);
      setSosActivated(true);
      sendSOSAlert();
    }, 5000);
  };

  const handlePressOut = () => {
    setHolding(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  React.useEffect(() => {
    if (!sosActivated) return;
    const t = setTimeout(() => setSosActivated(false), 4000);
    return () => clearTimeout(t);
  }, [sosActivated]);

  return (
    <ScrollView contentContainerStyle={[styles.screenPad, {paddingBottom: 140, backgroundColor: '#111827'}]}>
      <View style={styles.textCenter}>
        <View style={styles.sosPulseWrap}>
          <View style={[styles.sosPulse, {opacity: 0.3}]} />
          <View style={[styles.sosPulse, {opacity: 0.4, transform: [{scale: 1.25}]}]} />
          <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.sosBtn}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <Text style={styles.sosBtnText}>{sosActivated ? 'ON' : 'SOS'}</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <Text style={styles.sosNote}>
          {loading ? t('sendingSOS') : sosActivated ? t('emergencySent') : holding ? t('keepHolding') : t('holdToActivate')}
        </Text>
        <Text style={styles.sosSubNote}>{t('emergencyServicesNotified')}</Text>
      </View>
      <View style={[styles.card, {marginTop: 16}]}>
        <ActionRow emoji="👮" title="Call Police" subtitle="Direct line to security" color="#DC2626" btnLabel="Respond" />
        <ActionRow emoji="💬" title="Send Alert Message" subtitle="Notify emergency contacts" color="#DC2626" btnLabel="Respond" />
        <ActionRow emoji="📍" title="Share Live Location" subtitle="Continuous location tracking" color="#DC2626" btnLabel="Respond" />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <KeyValueRow label="Police Control Room" phone="100" />
        <KeyValueRow label="Medical Emergency" phone="108" />
        <KeyValueRow label="Kumbh Control Room" phone="1950" />
      </View>
      <View style={{height: 24}} />
    </ScrollView>
  );
};

const ActionRow = ({emoji, title, subtitle, color, btnLabel}) => (
  <View style={[styles.actionRow, {borderColor: color}] }>
    <View style={[styles.round48, {backgroundColor: color}]}><Text style={styles.round48Text}>{emoji}</Text></View>
    <View style={{flex: 1}}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <TouchableOpacity style={[styles.smallBtn, {backgroundColor: color}]}><Text style={styles.smallBtnText}>{btnLabel}</Text></TouchableOpacity>
  </View>
);

const KeyValueRow = ({label, phone}) => (
  <View style={styles.kvRow}>
    <Text style={styles.kvLabelDark}>{label}</Text>
    <TouchableOpacity
      onPress={async () => {
        const url = `tel:${phone}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Cannot place call', `${label}: ${phone}`);
        }
      }}
      activeOpacity={0.8}
    >
      <Text style={styles.kvValueDark}>{phone}</Text>
    </TouchableOpacity>
  </View>
);

