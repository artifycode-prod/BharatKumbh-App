import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { Header } from '../components/Header';
import { styles } from '../styles/styles';

export const LostFoundDetails = ({route, navigation}) => {
  const item = route?.params?.item;

  if (!item) {
    return (
      <ScrollView contentContainerStyle={styles.screenPad}>
        <Header title="Report Details" icon="🔍" onBack={() => navigation.goBack()} />
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No report data available</Text>
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

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  const getItemIcon = (itemName) => {
    const name = (itemName || '').toLowerCase();
    if (name.includes('wallet') || name.includes('purse')) return '👜';
    if (name.includes('phone') || name.includes('mobile')) return '📱';
    if (name.includes('bag') || name.includes('luggage')) return '🎒';
    if (name.includes('key')) return '🔑';
    if (name.includes('id') || name.includes('card')) return '🪪';
    if (name.includes('person') || name.includes('child')) return '👤';
    return '🪔';
  };

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert('No Phone Number', 'Contact phone number is not available');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(err => {
      Alert.alert('Error', 'Unable to make phone call');
      console.error('Call error:', err);
    });
  };

  const handleSMS = (phone) => {
    if (!phone) {
      Alert.alert('No Phone Number', 'Contact phone number is not available');
      return;
    }
    Linking.openURL(`sms:${phone}`).catch(err => {
      Alert.alert('Error', 'Unable to send SMS');
      console.error('SMS error:', err);
    });
  };

  // Get image source - handle both base64, URLs, and file paths
  const getImageSource = (imageUri) => {
    if (!imageUri) return null;
    
    // If it's a full URL
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return { uri: imageUri };
    }
    
    // If it's a file:// path (local file)
    if (imageUri.startsWith('file://')) {
      return { uri: imageUri };
    }
    
    // If it's base64
    if (imageUri.startsWith('data:image')) {
      return { uri: imageUri };
    }
    
    // Try as relative URL
    return { uri: imageUri };
  };

  const images = item.images || [];
  const hasImages = images.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Report Details" icon="🔍" onBack={() => navigation.goBack()} />
      
      {/* Item Type Badge */}
      <View style={styles.card}>
        <View style={[styles.cardRow, {alignItems: 'center'}]}>
          <View style={[styles.round64, {backgroundColor: item.type === 'lost' ? '#F59E0B' : '#10B981'}]}>
            <Text style={styles.round64Text}>{getItemIcon(item.itemName)}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={[styles.sectionTitle, {marginBottom: 4}]}>
              {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
            </Text>
            <Text style={[styles.rowSubtitle, {fontSize: 12, color: item.type === 'lost' ? '#F59E0B' : '#10B981'}]}>
              Status: {item.status || 'open'} • {formatRelativeTime(item.createdAt || item.created_at)}
            </Text>
          </View>
        </View>
      </View>

      {/* Item Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Item Information</Text>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Item Name:</Text>
          <Text style={styles.kvValueDark}>{item.itemName || 'N/A'}</Text>
        </View>
        
        {item.description && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Description:</Text>
            <Text style={styles.kvValueDark}>{item.description}</Text>
          </View>
        )}

        {item.isPerson && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Type:</Text>
            <Text style={styles.kvValueDark}>Person</Text>
          </View>
        )}
      </View>

      {/* Location Information */}
      {item.location && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          {item.location.address && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Address:</Text>
              <Text style={styles.kvValueDark}>{item.location.address}</Text>
            </View>
          )}
          
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Coordinates:</Text>
            <Text style={[styles.kvValueDark, {fontSize: 12}]}>
              {item.location.latitude?.toFixed(6)}, {item.location.longitude?.toFixed(6)}
            </Text>
          </View>
        </View>
      )}

      {/* Contact Information */}
      {item.contactInfo && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {item.contactInfo.phone && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Phone:</Text>
              <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                <Text style={styles.kvValueDark}>{item.contactInfo.phone}</Text>
                <TouchableOpacity
                  onPress={() => handleCall(item.contactInfo.phone)}
                  style={[styles.smallBtn, {backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6}]}
                >
                  <Text style={styles.smallBtnText}>📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSMS(item.contactInfo.phone)}
                  style={[styles.smallBtn, {backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6}]}
                >
                  <Text style={styles.smallBtnText}>💬 SMS</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {item.contactInfo.email && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Email:</Text>
              <Text style={styles.kvValueDark}>{item.contactInfo.email}</Text>
            </View>
          )}
        </View>
      )}

      {/* Images */}
      {hasImages && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photos ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 12}}>
            {images.map((imageUri, index) => {
              const imageSource = getImageSource(imageUri);
              if (!imageSource) return null;
              
              return (
                <View key={index} style={{marginRight: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6'}}>
                  <Image 
                    source={imageSource} 
                    style={{
                      width: 200,
                      height: 200,
                      resizeMode: 'cover'
                    }}
                    onError={(error) => {
                      console.log('Image load error:', error);
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Report Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report Information</Text>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Reported On:</Text>
          <Text style={styles.kvValueDark}>{formatDate(item.createdAt || item.created_at)}</Text>
        </View>
        
        {item.reportedBy && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Reported By:</Text>
            <Text style={styles.kvValueDark}>
              {typeof item.reportedBy === 'object' 
                ? (item.reportedBy.name || item.reportedBy.email || 'User')
                : 'User'}
            </Text>
          </View>
        )}

        {item.status && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Status:</Text>
            <Text style={[styles.kvValueDark, {
              color: item.status === 'matched' ? '#10B981' : 
                     item.status === 'resolved' ? '#3B82F6' : 
                     item.status === 'closed' ? '#6B7280' : '#F59E0B',
              textTransform: 'capitalize'
            }]}>
              {item.status}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

