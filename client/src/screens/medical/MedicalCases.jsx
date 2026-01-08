import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllCases, resolveCase } from '../../services/medicalService';

export const MedicalCases = ({goHome}) => {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCases = async () => {
    try {
      const allCases = await getAllCases();
      setCases(allCases);
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('Error', 'Failed to load medical cases');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const filtered = filter === 'all' 
    ? cases 
    : filter === 'en-route'
      ? cases.filter(c => c.status === 'in-progress')
      : filter === 'in-progress'
        ? cases.filter(c => c.status === 'in-progress')
        : cases.filter(c => c.status === 'resolved');


  const handleResolve = async (caseId) => {
    Alert.alert(
      'Resolve Case',
      'Are you sure you want to mark this case as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await resolveCase(caseId);
              await loadCases();
              Alert.alert('Success', 'Case resolved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to resolve case');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadCases} />}
    >
      <Header title="Medical Cases" icon="📋" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter Cases</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity 
            onPress={() => setFilter('all')}
            style={[styles.chip, filter === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('in-progress')}
            style={[styles.chip, filter === 'in-progress' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'in-progress' && styles.chipTextActive]}>In Progress</Text>
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
      ) : filtered.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No cases found</Text>
        </View>
      ) : (
        filtered.map((medicalCase) => (
          <View key={medicalCase._id || medicalCase.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: getSeverityColor(medicalCase.severity)}]}>
              <Text style={styles.round48Text}>🚑</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{medicalCase.patientName}</Text>
              <Text style={styles.rowSubtitle}>
                {medicalCase.caseType} • {medicalCase.severity} • {medicalCase.status}
              </Text>
              {medicalCase.description && (
                <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                  {medicalCase.description}
                </Text>
              )}
            </View>
            {medicalCase.status !== 'resolved' && (
              <TouchableOpacity
                style={[styles.smallBtn, {backgroundColor: '#16A34A'}]}
                onPress={() => handleResolve(medicalCase._id || medicalCase.id)}
              >
                <Text style={styles.smallBtnText}>Resolve</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

    </ScrollView>
  );
};

const getSeverityColor = (severity) => {
  const colors = {
    critical: '#DC2626',
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };
  return colors[severity] || '#6B7280';
};
