import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { API_CONFIG } from '../../config/api';

export const RegistrationDetails = ({route, navigation}) => {
  const registration = route?.params?.registration;

  if (!registration) {
    return (
      <ScrollView contentContainerStyle={styles.screenPad}>
        <Header title="Registration Details" icon="📱" onBack={() => navigation.goBack()} />
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No registration data available</Text>
        </View>
      </ScrollView>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get image source - could be base64, full URL, or relative path
  const getImageSource = () => {
    if (!registration.groupSelfie) return null;
    
    const selfie = registration.groupSelfie;
    
    // Check if it's a base64 data URI (with prefix)
    if (typeof selfie === 'string' && (selfie.startsWith('data:image') || selfie.startsWith('data:image/'))) {
      return { uri: selfie };
    }
    
    // Check if it's a plain base64 string (without data URI prefix)
    // Base64 strings are typically long and contain only base64 characters
    if (typeof selfie === 'string' && selfie.length > 100) {
      // Check if it looks like base64 (contains only base64 characters)
      const base64Pattern = /^[A-Za-z0-9+/=]+$/;
      if (base64Pattern.test(selfie.replace(/\s/g, ''))) {
        // Convert to data URI
        return { uri: `data:image/jpeg;base64,${selfie}` };
      }
    }
    
    // Check if it's a file:// URI (local file)
    if (typeof selfie === 'string' && selfie.startsWith('file://')) {
      return { uri: selfie };
    }
    
    // If it's already a full URL, return it
    if (typeof selfie === 'string' && (selfie.startsWith('http://') || selfie.startsWith('https://'))) {
      return { uri: selfie };
    }
    
    // If it's a relative path or filename, construct full URL
    if (typeof selfie === 'string' && selfie !== 'present' && selfie.trim() !== '') {
      // Remove leading slash if present
      const path = selfie.startsWith('/') ? selfie.slice(1) : selfie;
      return { uri: `${API_CONFIG.BASE_URL}/${path}` };
    }
    
    return null;
  };

  const imageSource = getImageSource();

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Registration Details" icon="📱" onBack={() => navigation.goBack()} />
      
      {/* Group Selfie Image */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Selfie</Text>
        {imageSource ? (
          <View style={{marginTop: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6'}}>
            <Image 
              source={imageSource} 
              style={{
                width: '100%',
                height: 300,
                resizeMode: 'cover'
              }}
              onError={(error) => {
                console.log('Image load error:', error);
                console.log('Image source:', imageSource);
                console.log('Group selfie value:', registration.groupSelfie);
              }}
              onLoad={() => {
                console.log('Image loaded successfully');
              }}
            />
          </View>
        ) : (
          <View style={{
            width: '100%',
            height: 200,
            backgroundColor: '#F3F4F6',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12
          }}>
            <Text style={styles.round64Text}>📸</Text>
            <Text style={[styles.rowSubtitle, {marginTop: 8, textAlign: 'center'}]}>
              {registration.groupSelfie 
                ? 'Image data available but cannot be displayed' 
                : 'No group selfie available'}
            </Text>
            {registration.groupSelfie && (
              <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 10, color: '#9CA3AF'}]}>
                Type: {typeof registration.groupSelfie} | 
                Length: {registration.groupSelfie?.length || 0} | 
                Preview: {String(registration.groupSelfie).substring(0, 50)}...
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Registration Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Registration Information</Text>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>QR Code ID:</Text>
          <Text style={styles.kvValueDark}>{registration.qrCodeId || 'N/A'}</Text>
        </View>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Destination:</Text>
          <Text style={styles.kvValueDark}>{registration.intendedDestination || 'N/A'}</Text>
        </View>
        
        {registration.customDestination && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Custom Destination:</Text>
            <Text style={styles.kvValueDark}>{registration.customDestination}</Text>
          </View>
        )}
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Group Size:</Text>
          <Text style={styles.kvValueDark}>{registration.groupSize || 'N/A'} people</Text>
        </View>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Luggage Count:</Text>
          <Text style={styles.kvValueDark}>{registration.luggageCount || 0} items</Text>
        </View>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Entry Point:</Text>
          <Text style={styles.kvValueDark}>
            {registration.entryPointName || registration.entryPoint || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Entry Point Code:</Text>
          <Text style={styles.kvValueDark}>
            {registration.entryPoint || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      {(registration.contactInfo?.name || registration.contactInfo?.phone) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {registration.contactInfo?.name && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Contact Name:</Text>
              <Text style={styles.kvValueDark}>{registration.contactInfo.name}</Text>
            </View>
          )}
          
          {registration.contactInfo?.phone && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Contact Phone:</Text>
              <Text style={styles.kvValueDark}>{registration.contactInfo.phone}</Text>
            </View>
          )}
          
          {registration.contactInfo?.email && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Contact Email:</Text>
              <Text style={styles.kvValueDark}>{registration.contactInfo.email}</Text>
            </View>
          )}
        </View>
      )}

      {/* Location Information */}
      {registration.location && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          
          {registration.location.latitude && registration.location.longitude && (
            <>
              <View style={styles.kvRow}>
                <Text style={styles.kvLabelDark}>Latitude:</Text>
                <Text style={styles.kvValueDark}>{registration.location.latitude}</Text>
              </View>
              
              <View style={styles.kvRow}>
                <Text style={styles.kvLabelDark}>Longitude:</Text>
                <Text style={styles.kvValueDark}>{registration.location.longitude}</Text>
              </View>
            </>
          )}
          
          {registration.location?.address && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Address:</Text>
              <Text style={styles.kvValueDark}>{registration.location.address}</Text>
            </View>
          )}
        </View>
      )}

      {/* Timestamp Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Timestamps</Text>
        
        {(registration.registeredAt || registration.createdAt) && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Registered At:</Text>
            <Text style={styles.kvValueDark}>
              {formatDate(registration.registeredAt || registration.createdAt)}
            </Text>
          </View>
        )}
        
        {registration.updatedAt && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Last Updated:</Text>
            <Text style={styles.kvValueDark}>{formatDate(registration.updatedAt)}</Text>
          </View>
        )}
        
        {registration.registeredBy && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Registered By:</Text>
            <Text style={styles.kvValueDark}>
              {typeof registration.registeredBy === 'object' 
                ? registration.registeredBy.name || registration.registeredBy.email || 'User'
                : 'User'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

