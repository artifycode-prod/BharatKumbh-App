import React from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Header';
import { resolveSOS } from '../../services/sosService';
import { styles } from '../../styles/styles';

export const EmergencyDetails = ({route, navigation}) => {
  const emergency = route?.params?.emergency;
  const [loading, setLoading] = React.useState(false);
  const [emergencyData, setEmergencyData] = React.useState(emergency);

  if (!emergencyData) {
    return (
      <ScrollView contentContainerStyle={styles.screenPad}>
        <Header title="Emergency Details" icon="🚨" onBack={() => navigation.goBack()} />
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No emergency data available</Text>
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
    if (!dateString) return 'Just now';
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

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    return colors[priority] || '#6B7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      acknowledged: '#3B82F6',
      resolved: '#10B981'
    };
    return colors[status] || '#6B7280';
  };

  const handleResolve = async () => {
    try {
      setLoading(true);
      const updated = await resolveSOS(emergencyData._id || emergencyData.id);
      setEmergencyData(updated);
      Alert.alert('Success', 'Emergency alert resolved');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resolve alert');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = () => {
    if (!emergencyData.location) return;
    const { latitude, longitude } = emergencyData.location;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert('No Phone Number', 'Contact phone number is not available');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(err => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.screenPad, {paddingBottom: 40}]}>
      <Header title="Emergency Details" icon="🚨" onBack={() => navigation.goBack()} />
      
      {/* Priority Badge */}
      <View style={styles.card}>
        <View style={[styles.cardRow, {alignItems: 'center'}]}>
          <LinearGradient 
            colors={[getPriorityColor(emergencyData.priority), getPriorityColor(emergencyData.priority) + 'CC']}
            style={[styles.round64, {
              shadowColor: getPriorityColor(emergencyData.priority),
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: {width: 0, height: 4},
              elevation: 4,
            }]}
          >
            <Text style={styles.round64Text}>🚨</Text>
          </LinearGradient>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={[styles.sectionTitle, {marginBottom: 4, textTransform: 'capitalize'}]}>
              {emergencyData.priority} Priority Alert
            </Text>
            <Text style={[styles.rowSubtitle, {fontSize: 12, color: getStatusColor(emergencyData.status)}]}>
              Status: {emergencyData.status || 'pending'} • {formatRelativeTime(emergencyData.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Message */}
      {emergencyData.message && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Message</Text>
          <Text style={[styles.rowSubtitle, {marginTop: 8, lineHeight: 22}]}>
            {emergencyData.message}
          </Text>
        </View>
      )}

      {/* Location Information */}
      {emergencyData.location && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          {emergencyData.location.address && (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Address:</Text>
              <Text style={styles.kvValueDark}>{emergencyData.location.address}</Text>
            </View>
          )}
          
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Coordinates:</Text>
            <Text style={[styles.kvValueDark, {fontSize: 12}]}>
              {emergencyData.location.latitude?.toFixed(6)}, {emergencyData.location.longitude?.toFixed(6)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleOpenMap}
            style={{
              marginTop: 12,
              backgroundColor: '#3B82F6',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{color: 'white', fontWeight: '700'}}>📍 Open in Maps</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User Information */}
      {emergencyData.userId && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reported By</Text>
          {typeof emergencyData.userId === 'object' ? (
            <>
              <View style={styles.kvRow}>
                <Text style={styles.kvLabelDark}>Name:</Text>
                <Text style={styles.kvValueDark}>{emergencyData.userId.name || 'N/A'}</Text>
              </View>
              {emergencyData.userId.phone && (
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabelDark}>Phone:</Text>
                  <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                    <Text style={styles.kvValueDark}>{emergencyData.userId.phone}</Text>
                    <TouchableOpacity
                      onPress={() => handleCall(emergencyData.userId.phone)}
                      style={[styles.smallBtn, {backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6}]}
                    >
                      <Text style={styles.smallBtnText}>📞 Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {emergencyData.userId.email && (
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabelDark}>Email:</Text>
                  <Text style={styles.kvValueDark}>{emergencyData.userId.email}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>User ID:</Text>
              <Text style={styles.kvValueDark}>{emergencyData.userId}</Text>
            </View>
          )}
        </View>
      )}

      {/* Assigned To */}
      {emergencyData.assignedTo && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Assigned To</Text>
          {typeof emergencyData.assignedTo === 'object' ? (
            <>
              <View style={styles.kvRow}>
                <Text style={styles.kvLabelDark}>Name:</Text>
                <Text style={styles.kvValueDark}>{emergencyData.assignedTo.name || 'N/A'}</Text>
              </View>
              {emergencyData.assignedTo.phone && (
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabelDark}>Phone:</Text>
                  <Text style={styles.kvValueDark}>{emergencyData.assignedTo.phone}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Staff ID:</Text>
              <Text style={styles.kvValueDark}>{emergencyData.assignedTo}</Text>
            </View>
          )}
        </View>
      )}

      {/* Alert Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Alert Information</Text>
        
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Created On:</Text>
          <Text style={styles.kvValueDark}>{formatDate(emergencyData.createdAt)}</Text>
        </View>
        
        {emergencyData.resolvedAt && (
          <View style={styles.kvRow}>
            <Text style={styles.kvLabelDark}>Resolved On:</Text>
            <Text style={styles.kvValueDark}>{formatDate(emergencyData.resolvedAt)}</Text>
          </View>
        )}

        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Priority:</Text>
          <Text style={[styles.kvValueDark, {
            color: getPriorityColor(emergencyData.priority),
            textTransform: 'capitalize',
            fontWeight: '700'
          }]}>
            {emergencyData.priority}
          </Text>
        </View>

        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Status:</Text>
          <Text style={[styles.kvValueDark, {
            color: getStatusColor(emergencyData.status),
            textTransform: 'capitalize',
            fontWeight: '700'
          }]}>
            {emergencyData.status}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {emergencyData.status !== 'resolved' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            onPress={handleResolve}
            disabled={loading}
            style={{
              marginTop: 12,
              backgroundColor: '#10B981',
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color: 'white', fontWeight: '700', fontSize: 16}}>✓ Resolve Alert</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

