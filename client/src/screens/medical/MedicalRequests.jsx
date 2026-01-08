import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllCases } from '../../services/medicalService';

export const MedicalRequests = ({goHome}) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    try {
      const cases = await getAllCases();
      const pendingCases = cases.filter(c => c.status === 'pending');
      setRequests(pendingCases);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', 'Failed to load medical requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = filter === 'all' 
    ? requests 
    : requests.filter(r => r.severity === filter);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    return colors[severity] || '#6B7280';
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRequests} />}
    >
      <Header title="Medical Requests" icon="🚨" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter by Severity</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity 
            onPress={() => setFilter('all')}
            style={[styles.chip, filter === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
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
          <TouchableOpacity 
            onPress={() => setFilter('medium')}
            style={[styles.chip, filter === 'medium' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'medium' && styles.chipTextActive]}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('low')}
            style={[styles.chip, filter === 'low' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'low' && styles.chipTextActive]}>Low</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No requests found</Text>
        </View>
      ) : (
        filtered.map((request) => (
          <View key={request._id || request.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: getSeverityColor(request.severity)}]}>
              <Text style={styles.round48Text}>🚑</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{request.patientName}</Text>
              <Text style={styles.rowSubtitle}>
                {request.medicalIssue || request.description} • {request.severity}
              </Text>
              {request.patientAge && (
                <Text style={[styles.rowSubtitle, {marginTop: 4}]}>
                  Age: {request.patientAge} {request.patientGender ? `• ${request.patientGender}` : ''}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
