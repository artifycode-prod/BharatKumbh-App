import React from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../components/Header';
import { styles } from '../styles/styles';
import { createSOS } from '../services/sosService';
import { getCurrentPosition } from '../utils/location';

export const SOS = ({goHome}) => {
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
        Alert.alert('SOS Alert Sent', 'Emergency services have been notified with your location!');
      } catch (error) {
        console.error('SOS Error:', error);
        let errorMessage = 'Failed to send SOS alert';
        
        if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          if (error.response.data?.errors) {
            errorMessage = error.response.data.errors.map(e => e.msg || e.message).join('\n');
          }
        } else if (error.request) {
          // Request made but no response
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else {
          errorMessage = error.message || errorMessage;
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert('Error', error.message || 'Failed to get location for SOS alert');
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
      <Header title="EMERGENCY SOS" icon="🚨" accent="red" onBack={goHome} />
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
          {loading ? 'Sending SOS alert...' : sosActivated ? 'Emergency signal sent!' : holding ? 'Keep holding to activate SOS…' : 'HOLD FOR 5 SECONDS TO ACTIVATE'}
        </Text>
        <Text style={styles.sosSubNote}>Emergency services will be notified immediately</Text>
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

