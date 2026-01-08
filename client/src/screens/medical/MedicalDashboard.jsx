import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllCases } from '../../services/medicalService';
import { getUserName, getUserRole } from '../../services/authService';

export const MedicalDashboard = ({goHome, navigate, onProfile, onSignOut}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const loadDashboard = async () => {
    try {
      const allCases = await getAllCases();
      setCases(allCases);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load medical cases');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredCases = filter === 'all' 
    ? cases 
    : filter === 'pending'
      ? cases.filter(c => c.status === 'pending')
      : filter === 'in-progress'
        ? cases.filter(c => c.status === 'in-progress')
        : filter === 'resolved'
          ? cases.filter(c => c.status === 'resolved')
          : filter === 'critical'
            ? cases.filter(c => c.severity === 'critical')
            : cases;

  const handleCasePress = (medicalCase) => {
    console.log('Case pressed:', medicalCase);
    if (navigate) {
      console.log('Navigating to MedicalCaseDetail with case:', medicalCase.patientName);
      navigate('MedicalCaseDetail', { caseData: medicalCase });
    } else {
      console.error('Navigate function not available');
      Alert.alert('Error', 'Navigation not available');
    }
  };

  useEffect(() => {
    loadDashboard();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const [name, role] = await Promise.all([getUserName(), getUserRole()]);
    setUserName(name);
    setUserRole(role);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <LinearGradient colors={['#F87171', '#EF4444']} style={styles.brandBadge}>
            <Text style={styles.brandEmoji}>🚑</Text>
          </LinearGradient>
          <View style={{flex: 1}}>
            <Text style={styles.brandTitle}>Medical Dashboard</Text>
            <Text style={styles.brandSubtitle}>Health & Care</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={onProfile || (() => setShowProfile(true))} 
              activeOpacity={0.8}
              style={styles.headerBtn}
            >
              <Text style={styles.textOrange}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Medical Cases</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[styles.chip, filter === 'all' && styles.chipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>
              All ({cases.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, filter === 'pending' && styles.chipActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.chipText, filter === 'pending' && styles.chipTextActive]}>
              Pending ({cases.filter(c => c.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, filter === 'in-progress' && styles.chipActive]}
            onPress={() => setFilter('in-progress')}
          >
            <Text style={[styles.chipText, filter === 'in-progress' && styles.chipTextActive]}>
              Active ({cases.filter(c => c.status === 'in-progress').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, filter === 'critical' && styles.chipActive]}
            onPress={() => setFilter('critical')}
          >
            <Text style={[styles.chipText, filter === 'critical' && styles.chipTextActive]}>
              Critical ({cases.filter(c => c.severity === 'critical').length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cases List */}
      {loading ? (
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={[styles.rowSubtitle, {textAlign: 'center', marginTop: 12}]}>Loading cases...</Text>
        </View>
      ) : filteredCases.length === 0 ? (
        <View style={styles.card}>
          <Text style={[styles.rowSubtitle, {textAlign: 'center'}]}>No cases found</Text>
        </View>
      ) : (
        filteredCases.map((medicalCase) => (
          <TouchableOpacity
            key={medicalCase._id || medicalCase.id}
            activeOpacity={0.7}
            onPress={() => handleCasePress(medicalCase)}
          >
            <View style={[styles.card, {
              borderLeftWidth: 4,
              borderLeftColor: getSeverityColor(medicalCase.severity),
              marginBottom: 12
            }]}>
              <View style={styles.cardRow}>
                <View style={[styles.round48, {backgroundColor: getSeverityColor(medicalCase.severity)}]}>
                  <Text style={styles.round48Text}>🚑</Text>
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={[styles.rowTitle, {fontSize: 16, marginBottom: 4}]}>
                    {medicalCase.patientName || 'Unknown Patient'}
                  </Text>
                  <Text style={[styles.rowSubtitle, {marginBottom: 4}]}>
                    {medicalCase.caseType || 'Consultation'} • {medicalCase.severity || 'medium'}
                  </Text>
                  {medicalCase.description && (
                    <Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]} numberOfLines={2}>
                      {medicalCase.description}
                    </Text>
                  )}
                  <View style={{flexDirection: 'row', marginTop: 8, gap: 8}}>
                    <View style={[styles.chip, {
                      backgroundColor: getStatusColor(medicalCase.status) + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4
                    }]}>
                      <Text style={[styles.chipText, {
                        color: getStatusColor(medicalCase.status),
                        fontSize: 10,
                        fontWeight: '600'
                      }]}>
                        {medicalCase.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                      </Text>
                    </View>
                    {medicalCase.patientAge && (
                      <Text style={[styles.rowSubtitle, {fontSize: 10}]}>
                        Age: {medicalCase.patientAge}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 20}}>›</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Profile Modal */}
      {showProfile && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20}}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <TouchableOpacity onPress={() => setShowProfile(false)}>
                <Text style={styles.textRedStrong}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardCenter}>
              <LinearGradient colors={['#F87171', '#EF4444']} style={[styles.round64, {shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: {width: 0, height: 8}, shadowRadius: 16, elevation: 6}]}>
                <Text style={styles.round64Text}>🚑</Text>
              </LinearGradient>
              <Text style={[styles.authTitle, {marginTop: 12}]}>{userName || 'Medical Staff'}</Text>
              <Text style={styles.smallMutedCenter}>Medical Team</Text>
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, {backgroundColor: '#DC2626', marginTop: 16}]}
              onPress={async () => {
                setShowProfile(false);
                if (onSignOut) {
                  await onSignOut();
                }
              }}
            >
              <Text style={styles.primaryBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
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

const getStatusColor = (status) => {
  const colors = {
    pending: '#F59E0B',
    'in-progress': '#3B82F6',
    resolved: '#16A34A',
    referred: '#8B5CF6'
  };
  return colors[status] || '#6B7280';
};
