import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllSOS, acknowledgeSOS, resolveSOS } from '../../services/sosService';

export const VolunteerSOS = ({goHome}) => {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSOS = async () => {
    try {
      const alerts = await getAllSOS({ status: filter === 'all' ? undefined : filter });
      setSosAlerts(alerts);
    } catch (error) {
      console.error('Error loading SOS alerts:', error);
      Alert.alert('Error', 'Failed to load SOS alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSOS();
  }, [filter]);

  const handleAcknowledge = async (sosId) => {
    try {
      await acknowledgeSOS(sosId);
      await loadSOS();
      Alert.alert('Success', 'SOS alert acknowledged');
    } catch (error) {
      Alert.alert('Error', 'Failed to acknowledge SOS alert');
    }
  };

  const handleResolve = async (sosId) => {
    Alert.alert(
      'Resolve SOS',
      'Are you sure this SOS alert is resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await resolveSOS(sosId);
              await loadSOS();
              Alert.alert('Success', 'SOS alert resolved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to resolve SOS alert');
            }
          }
        }
      ]
    );
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

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSOS} />}
    >
      <Header title="SOS Alerts" icon="🚨" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter Alerts</Text>
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
            onPress={() => setFilter('acknowledged')}
            style={[styles.chip, filter === 'acknowledged' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'acknowledged' && styles.chipTextActive]}>Acknowledged</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('resolved')}
            style={[styles.chip, filter === 'resolved' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'resolved' && styles.chipTextActive]}>Resolved</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading...</Text>
        </View>
      ) : sosAlerts.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No SOS alerts found</Text>
        </View>
      ) : (
        sosAlerts.map((alert) => (
          <View key={alert._id || alert.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: getPriorityColor(alert.priority)}]}>
              <Text style={styles.round48Text}>🚨</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>SOS Alert</Text>
              <Text style={styles.rowSubtitle}>
                Priority: {alert.priority} • Status: {alert.status}
              </Text>
              {alert.message && (
                <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                  {alert.message}
                </Text>
              )}
              {alert.location && (
                <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                  Location: {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              {alert.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.smallBtn, {backgroundColor: '#3B82F6'}]}
                  onPress={() => handleAcknowledge(alert._id || alert.id)}
                >
                  <Text style={styles.smallBtnText}>Accept</Text>
                </TouchableOpacity>
              )}
              {alert.status === 'acknowledged' && (
                <TouchableOpacity
                  style={[styles.smallBtn, {backgroundColor: '#16A34A'}]}
                  onPress={() => handleResolve(alert._id || alert.id)}
                >
                  <Text style={styles.smallBtnText}>Resolve</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
