import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Header';
import { getAllSOS } from '../../services/sosService';
import { styles } from '../../styles/styles';

export const AdminEmergency = ({goHome, navigation}) => {
  const [emergencies, setEmergencies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEmergencies = async () => {
    try {
      const sosAlerts = await getAllSOS();
      setEmergencies(sosAlerts);
    } catch (error) {
      console.error('Error loading emergencies:', error);
      Alert.alert('Error', 'Failed to load emergencies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  const filteredEmergencies = filter === 'all' 
    ? emergencies 
    : filter === 'pending' 
      ? emergencies.filter(e => e.status === 'pending')
      : emergencies.filter(e => e.priority === filter);

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    return colors[priority] || '#6B7280';
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEmergencies} />}
    >
      <Header title="Emergency" icon="🚨" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter Emergencies</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity 
            onPress={() => setFilter('all')}
            style={[styles.chip, filter === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('pending')}
            style={[styles.chip, filter === 'pending' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'pending' && styles.chipTextActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('critical')}
            style={[styles.chip, filter === 'critical' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'critical' && styles.chipTextActive]}>Critical</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('high')}
            style={[styles.chip, filter === 'high' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'high' && styles.chipTextActive]}>High</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.card}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#FB923C" />
            <Text style={[styles.rowSubtitle, {marginTop: 12}]}>Loading emergencies...</Text>
          </View>
        </View>
      ) : filteredEmergencies.length === 0 ? (
        <View style={styles.card}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={[styles.round64Text, {fontSize: 48, marginBottom: 12}]}>🚨</Text>
            <Text style={[styles.rowSubtitle, {textAlign: 'center'}]}>No emergencies found</Text>
          </View>
        </View>
      ) : (
        filteredEmergencies.map((emergency) => (
          <TouchableOpacity
            key={emergency._id || emergency.id}
            onPress={() => {
              if (navigation && navigation.navigate) {
                navigation.navigate('EmergencyDetails', { emergency });
              } else {
                Alert.alert('Navigation', 'Navigation not available');
              }
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 2,
              borderColor: emergency.status === 'pending' 
                ? getPriorityColor(emergency.priority) + '40'
                : 'rgba(251,146,60,0.25)',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: {width: 0, height: 2},
              elevation: 2,
            }}
          >
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <LinearGradient 
                colors={[getPriorityColor(emergency.priority), getPriorityColor(emergency.priority) + 'CC']}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: getPriorityColor(emergency.priority),
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  shadowOffset: {width: 0, height: 3},
                  elevation: 3,
                }}
              >
                <Text style={{fontSize: 24, color: 'white'}}>🚨</Text>
              </LinearGradient>
              
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <Text style={[styles.rowTitle, {flex: 1, textTransform: 'capitalize'}]}>
                    {emergency.priority} Priority Alert
                  </Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: emergency.status === 'pending' 
                      ? '#FEF3C7' 
                      : emergency.status === 'acknowledged'
                      ? '#DBEAFE'
                      : '#D1FAE5',
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: emergency.status === 'pending' 
                        ? '#D97706' 
                        : emergency.status === 'acknowledged'
                        ? '#1E40AF'
                        : '#065F46',
                      textTransform: 'capitalize',
                    }}>
                      {emergency.status}
                    </Text>
                  </View>
                </View>
                
                {emergency.message && (
                  <Text 
                    style={[styles.rowSubtitle, {marginBottom: 6, lineHeight: 18}]}
                    numberOfLines={2}
                  >
                    {emergency.message}
                  </Text>
                )}
                
                {emergency.location && (
                  <Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]} numberOfLines={1}>
                    📍 {emergency.location.address || `${emergency.location.latitude?.toFixed(4)}, ${emergency.location.longitude?.toFixed(4)}`}
                  </Text>
                )}
                
                <Text style={[styles.rowSubtitle, {fontSize: 10, color: '#9CA3AF', marginTop: 4}]}>
                  {new Date(emergency.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(251,146,60,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}>
                <Text style={{color: '#FB923C', fontSize: 18, fontWeight: '700'}}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
