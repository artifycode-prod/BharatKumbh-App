import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Header } from '../components/Header';
import { registerQR } from '../services/qrService';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

const DESTINATIONS = ['Tapovan', 'Panchvati', 'Trambak', 'Ramkund', 'Kalaram', 'Sita Gufa', 'Other'];
const ENTRY_POINTS = [
  { label: 'Railway Station', value: 'railway_station' },
  { label: 'Bus Stand', value: 'bus_stand' },
  { label: 'Parking Area', value: 'parking_area' },
  { label: 'Other', value: 'other' }
];

export const QR = ({goHome}) => {
  const [selfieUri, setSelfieUri] = useState(undefined);
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeId, setQrCodeId] = useState('');
  const [entryPoint, setEntryPoint] = useState('railway_station');
  const [entryPointName, setEntryPointName] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [luggageCount, setLuggageCount] = useState('');
  const [intendedDestination, setIntendedDestination] = useState('Ramkund');
  const [customDestination, setCustomDestination] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualQrCode, setManualQrCode] = useState('');

  const onScanOnce = useCallback(() => {
    setShowScanner(true);
  }, []);

  const onLiveScan = useCallback(() => {
    setShowScanner(true);
  }, []);

  const onScanSuccess = useCallback((e) => {
    console.log('onScanSuccess called with:', e);
    const data = e?.data ? String(e.data) : '';
    
    if (!data) {
      console.warn('No data in QR scan result');
      return;
    }
    
    // Close scanner first
    setShowScanner(false);
    
    // Accept any QR code - use the scanned data as QR Code ID
    setQrCodeId(data);
    
    // Try to parse QR data if it's JSON format
    try {
      const parsed = JSON.parse(data);
      if (parsed.entryPoint) setEntryPoint(parsed.entryPoint);
      if (parsed.entryPointName) setEntryPointName(parsed.entryPointName);
      Alert.alert('QR Scanned Successfully', `Entry Point: ${parsed.entryPointName || parsed.entryPoint || 'Detected'}`);
    } catch {
      // If not JSON, use as QR code ID (any QR code works)
      Alert.alert('QR Scanned Successfully', `QR Code ID: ${data.substring(0, 50)}${data.length > 50 ? '...' : ''}`);
    }
  }, []);

  const openSelfieCamera = useCallback(async () => {
    const res = await launchCamera({
      mediaType: 'photo', 
      cameraType: 'front', 
      saveToPhotos: false, 
      quality: 0.8,
      includeBase64: true
    });
    if (res?.assets && res.assets[0]?.uri) {
      setSelfieUri(res.assets[0].uri);
    }
  }, []);

  const convertImageToBase64 = async (uri) => {
    // For now, we'll send the URI and let backend handle it
    // In production, convert to base64 using a proper library
    return uri;
  };

  const onComplete = useCallback(async () => {
    if (!qrCodeId.trim()) {
      Alert.alert('QR Code Required', 'Please scan a QR code first');
      return;
    }
    if (!selfieUri) {
      Alert.alert('Selfie Required', 'Please take a group selfie');
      return;
    }
    if (!groupSize || parseInt(groupSize) < 1) {
      Alert.alert('Invalid Group Size', 'Please enter a valid group size (1-50)');
      return;
    }
    if (!luggageCount || parseInt(luggageCount) < 0) {
      Alert.alert('Invalid Luggage Count', 'Please enter a valid luggage count');
      return;
    }
    if (!contactPhone.trim()) {
      Alert.alert('Contact Required', 'Please enter a contact phone number');
      return;
    }
    if (intendedDestination === 'Other' && !customDestination.trim()) {
      Alert.alert('Destination Required', 'Please enter a custom destination');
      return;
    }

    setLoading(true);

    try {
      // Get location
      const location = await getCurrentPosition();
      
      try {
        // For now, send URI - backend can handle file upload
        // In production, convert to base64 properly
        const selfieBase64 = selfieUri;

        // Register with backend
        await registerQR({
          qrCodeId: qrCodeId.trim(),
          entryPoint,
          entryPointName: entryPointName || ENTRY_POINTS.find(ep => ep.value === entryPoint)?.label || 'Entry Point',
          groupSize: parseInt(groupSize),
          luggageCount: parseInt(luggageCount),
          intendedDestination,
          customDestination: intendedDestination === 'Other' ? customDestination : undefined,
          groupSelfie: selfieBase64,
          latitude: location.latitude,
          longitude: location.longitude,
          contactInfo: {
            phone: contactPhone.trim(),
            name: contactName.trim() || undefined
          }
        });

        Alert.alert('Registration Complete', 'Your group registration has been submitted successfully!', [
          {text: 'OK', onPress: goHome},
        ]);
      } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Failed to submit registration';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response) {
          // Server responded with error
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request made but no response
          errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct API URL in config\n3. Network connection';
        }
        
        Alert.alert('Registration Failed', errorMessage);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', error.message || 'Failed to get location');
      setLoading(false);
    }
  }, [qrCodeId, entryPoint, entryPointName, groupSize, luggageCount, intendedDestination, customDestination, contactPhone, contactName, selfieUri, goHome, openSelfieCamera]);

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="QR Registration" icon="📱" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Scan QR Code</Text>
        <Text style={[styles.smallMutedCenter, {marginBottom: 12, fontSize: 12}]}>
          Scan any QR code at entry points (Railway Station, Bus Stand, Parking Area)
        </Text>
        <View style={{flexDirection: 'row', gap: 8}}>
          <TouchableOpacity onPress={onScanOnce} style={[styles.primaryBtn, {flex: 1}]}> 
            <Text style={styles.primaryBtnText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => setShowManualEntry(!showManualEntry)} 
          style={{marginTop: 8, padding: 8}}
        >
          {/* <Text style={{color: '#FB923C', fontSize: 12, textAlign: 'center'}}>
            {showManualEntry ? 'Hide' : 'Or Enter QR Code Manually (for testing)'}
          </Text> */}
        </TouchableOpacity>
        
        {showManualEntry && (
          <View style={{marginTop: 12}}>
            <View style={styles.fieldInput}>
              <TextInput
                placeholder="Enter QR Code ID manually"
                placeholderTextColor="#9A3412"
                style={{height: 44, color: '#7C2D12'}}
                value={manualQrCode}
                onChangeText={setManualQrCode}
              />
            </View>
            <TouchableOpacity 
              onPress={() => {
                if (manualQrCode.trim()) {
                  onScanSuccess({data: manualQrCode.trim()});
                  setManualQrCode('');
                  setShowManualEntry(false);
                }
              }}
              style={[styles.primaryBtn, {marginTop: 8}]}
            >
              <Text style={styles.primaryBtnText}>Use This QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {qrCodeId ? (
          <View style={{marginTop: 8, padding: 12, backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 8}}>
            <Text style={{color: '#22C55E', fontSize: 12, fontWeight: '600'}}>✓ QR Code Scanned</Text>
            <Text style={{color: '#22C55E', fontSize: 11, marginTop: 4}} numberOfLines={2}>
              {qrCodeId.length > 60 ? `${qrCodeId.substring(0, 60)}...` : qrCodeId}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Entry Point</Text>
        <View style={[styles.fieldInput, {marginTop: 8}]}>
          <Picker
            selectedValue={entryPoint}
            onValueChange={(value) => setEntryPoint(value)}
            style={{color: '#7C2D12'}}
          >
            {ENTRY_POINTS.map(ep => (
              <Picker.Item key={ep.value} label={ep.label} value={ep.value} />
            ))}
          </Picker>
        </View>
        {entryPoint === 'other' && (
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Entry Point Name</Text>
            <View style={styles.fieldInput}>
              <TextInput
                placeholder="Enter entry point name"
                placeholderTextColor="#9A3412"
                style={{height: 44, color: '#7C2D12'}}
                value={entryPointName}
                onChangeText={setEntryPointName}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Registration</Text>
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Group Size</Text>
          <View style={styles.fieldInput}>
            <TextInput
              placeholder="Group Size (1-50)"
              placeholderTextColor="#9A3412"
              style={{height: 44, color: '#7C2D12'}}
              value={groupSize}
              onChangeText={setGroupSize}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Luggage Count</Text>
          <View style={styles.fieldInput}>
            <TextInput
              placeholder="Bags Limit (0-20)"
              placeholderTextColor="#9A3412"
              style={{height: 44, color: '#7C2D12'}}
              value={luggageCount}
              onChangeText={setLuggageCount}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Intended Destination</Text>
          <View style={[styles.fieldInput, {marginTop: 8}]}>
            <Picker
              selectedValue={intendedDestination}
              onValueChange={(value) => setIntendedDestination(value)}
              style={{color: '#7C2D12'}}
            >
              {DESTINATIONS.map(dest => (
                <Picker.Item key={dest} label={dest} value={dest} />
              ))}
            </Picker>
          </View>
        </View>
        {intendedDestination === 'Other' && (
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Custom Destination</Text>
            <View style={styles.fieldInput}>
              <TextInput
                placeholder="Enter destination name"
                placeholderTextColor="#9A3412"
                style={{height: 44, color: '#7C2D12'}}
                value={customDestination}
                onChangeText={setCustomDestination}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Phone Number *</Text>
          <View style={styles.fieldInput}>
            <TextInput
              placeholder="Enter phone number"
              placeholderTextColor="#9A3412"
              style={{height: 44, color: '#7C2D12'}}
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Contact Name (Optional)</Text>
          <View style={styles.fieldInput}>
            <TextInput
              placeholder="Enter contact name"
              placeholderTextColor="#9A3412"
              style={{height: 44, color: '#7C2D12'}}
              value={contactName}
              onChangeText={setContactName}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Selfie</Text>
        <View style={styles.selfieBox}>
          {selfieUri ? (
            <Image source={{uri: selfieUri}} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 16}} resizeMode="cover" />
          ) : (
            <View style={styles.round64}><Text style={styles.round64Text}>📸</Text></View>
          )}
        </View>
        <TouchableOpacity onPress={openSelfieCamera} style={[styles.primaryBtn, {marginTop: 12}]}> 
          <Text style={styles.primaryBtnText}>Take Group Selfie</Text>
        </TouchableOpacity>
        <Text style={styles.smallMutedCenter}>Capture group photo for identification</Text>
      </View>

      <TouchableOpacity 
        onPress={onComplete} 
        style={[styles.primaryBtn, loading && {opacity: 0.6}]}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>Complete Registration</Text>}
      </TouchableOpacity>

      <Modal isVisible={showScanner} style={{margin: 0}}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          {/* Back Button at Top */}
          <View style={{position: 'absolute', top: 40, left: 16, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25, padding: 8}}>
            <TouchableOpacity 
              onPress={() => setShowScanner(false)} 
              style={{padding: 8}}
              activeOpacity={0.7}
            >
              <Text style={{color: 'white', fontSize: 24}}>←</Text>
            </TouchableOpacity>
          </View>
          
          <QRCodeScanner
            onRead={(e) => {
              console.log('QR Code scanned:', e?.data);
              if (e?.data) {
                onScanSuccess({data: e.data});
              }
            }}
            flashMode={RNCamera.Constants.FlashMode.off}
            showMarker={true}
            markerStyle={{borderColor: '#FB923C', borderWidth: 2}}
            reactivate={true}
            reactivateTimeout={2000}
            fadeIn={true}
            vibrate={false}
            checkAndroid6Permissions={true}
            permissionDialogTitle="Camera Access"
            permissionDialogMessage="We need access to your camera to scan QR codes."
            cameraProps={{
              captureAudio: false,
              type: RNCamera.Constants.Type.back,
            }}
            notAuthorizedView={
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'black'}}>
                <Text style={{color: 'white', textAlign: 'center', marginBottom: 16, fontSize: 16}}>Camera access is disabled.</Text>
                <Text style={{color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 24, fontSize: 14}}>Enable it in Settings to scan QR codes.</Text>
                <TouchableOpacity onPress={() => Linking.openSettings()} style={[styles.primaryBtn, {backgroundColor: '#111827', marginBottom: 12}]}>
                  <Text style={styles.primaryBtnText}>Open Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowScanner(false)} style={[styles.primaryBtn, {backgroundColor: '#DC2626'}]}>
                  <Text style={styles.primaryBtnText}>Back</Text>
                </TouchableOpacity>
              </View>
            }
            topContent={
              <View style={{paddingTop: 60, paddingBottom: 20, backgroundColor: 'transparent'}}>
                <Text style={{color: 'white', textAlign: 'center', fontSize: 18, marginBottom: 8, fontWeight: '600'}}>Scan Any QR Code</Text>
                <Text style={{color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 14}}>Align the QR code within the frame</Text>
              </View>
            }
            bottomContent={
              <View style={{padding: 16, backgroundColor: 'transparent'}}>
                <TouchableOpacity onPress={() => setShowScanner(false)} style={[styles.primaryBtn, {backgroundColor: '#111827'}]}>
                  <Text style={styles.primaryBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            }
            cameraStyle={{height: '100%', width: '100%'}}
            containerStyle={{flex: 1}}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

