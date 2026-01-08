import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllRegistrations } from '../../services/qrService';

export const AdminRegistrations = ({goHome, navigation}) => {
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const DESTINATIONS = ['Tapovan', 'Panchvati', 'Trambak', 'Ramkund', 'Kalaram', 'Sita Gufa', 'Other'];

  const loadRegistrations = async (pageNum = 1, reset = false) => {
    try {
      setLoading(pageNum === 1);
      const response = await getAllRegistrations(pageNum, 50);
      const newRegistrations = response.registrations || [];
      
      if (reset) {
        setRegistrations(newRegistrations);
      } else {
        setRegistrations(prev => [...prev, ...newRegistrations]);
      }
      
      // Check if there are more pages based on pagination info
      if (response.pagination) {
        setHasMore(pageNum < response.pagination.pages);
      } else {
        setHasMore(newRegistrations.length === 50);
      }
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading registrations:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load registrations');
      if (reset) {
        setRegistrations([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRegistrations(1, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRegistrations(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadRegistrations(page + 1, false);
    }
  };

  const filteredRegistrations = filter === 'all' 
    ? registrations 
    : registrations.filter(r => r.intendedDestination === filter);

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

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onScrollEndDrag={() => {
        // Load more when scrolled to bottom
        loadMore();
      }}
    >
      <Header title="QR Registrations" icon="📱" onBack={goHome} />
      
      {/* Filter Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter by Destination</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 8}}>
          <View style={styles.chipsRow}>
            <TouchableOpacity 
              onPress={() => setFilter('all')}
              style={[styles.chip, filter === 'all' && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>
                All ({registrations.length})
              </Text>
            </TouchableOpacity>
            {DESTINATIONS.map((dest) => {
              const count = registrations.filter(r => r.intendedDestination === dest).length;
              return (
                <TouchableOpacity 
                  key={dest}
                  onPress={() => setFilter(dest)}
                  style={[styles.chip, filter === dest && styles.chipActive]}
                >
                  <Text style={[styles.chipText, filter === dest && styles.chipTextActive]}>
                    {dest} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Registrations List */}
      {loading && registrations.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading registrations...</Text>
        </View>
      ) : filteredRegistrations.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No registrations found</Text>
        </View>
      ) : (
        filteredRegistrations.map((reg) => (
          <TouchableOpacity
            key={reg._id || reg.id}
            style={styles.listRow}
            onPress={() => {
              if (navigation) {
                navigation.navigate('RegistrationDetails', { registration: reg });
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.round48, {backgroundColor: '#3B82F6'}]}>
              <Text style={styles.round48Text}>📱</Text>
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.rowTitle}>{reg.intendedDestination || 'Unknown Destination'}</Text>
              <Text style={styles.rowSubtitle}>
                Group: {reg.groupSize || 'N/A'} people • Entry: {reg.entryPointName || reg.entryPoint || 'N/A'}
              </Text>
              {reg.contactInfo?.name && (
                <Text style={[styles.rowSubtitle, {fontSize: 11, marginTop: 2}]}>
                  Contact: {reg.contactInfo.name} {reg.contactInfo?.phone ? `(${reg.contactInfo.phone})` : ''}
                </Text>
              )}
              {!reg.contactInfo?.name && reg.contactInfo?.phone && (
                <Text style={[styles.rowSubtitle, {fontSize: 11, marginTop: 2}]}>
                  Contact: {reg.contactInfo.phone}
                </Text>
              )}
              {(reg.registeredAt || reg.createdAt) && (
                <Text style={[styles.rowSubtitle, {fontSize: 10, marginTop: 2, color: '#6B7280'}]}>
                  {formatDate(reg.registeredAt || reg.createdAt)}
                </Text>
              )}
            </View>
            <Text style={styles.round32Text}>→</Text>
          </TouchableOpacity>
        ))
      )}

      {hasMore && filteredRegistrations.length > 0 && (
        <TouchableOpacity 
          style={[styles.card, {alignItems: 'center', padding: 16}]}
          onPress={loadMore}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            {loading ? 'Loading...' : 'Load More'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

