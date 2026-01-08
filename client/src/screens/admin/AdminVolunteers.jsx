import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllUsers, activateUser, deactivateUser } from '../../services/adminService';

export const AdminVolunteers = ({goHome}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVolunteers = async () => {
    try {
      const users = await getAllUsers();
      const volunteerList = users.filter(u => u.role === 'volunteer');
      setVolunteers(volunteerList);
    } catch (error) {
      console.error('Error loading volunteers:', error);
      Alert.alert('Error', 'Failed to load volunteers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleToggleStatus = async (volunteer, activate) => {
    try {
      if (activate) {
        await activateUser(volunteer._id || volunteer.id);
      } else {
        await deactivateUser(volunteer._id || volunteer.id);
      }
      await loadVolunteers();
      Alert.alert('Success', `Volunteer ${activate ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${activate ? 'activate' : 'deactivate'} volunteer`);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadVolunteers} />}
    >
      <Header title="Volunteers" icon="🤝" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Volunteer Management</Text>
        <Text style={styles.rowSubtitle}>Total Volunteers: {volunteers.length}</Text>
      </View>

      {loading ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading...</Text>
        </View>
      ) : volunteers.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No volunteers found</Text>
        </View>
      ) : (
        volunteers.map((volunteer) => (
          <View key={volunteer._id || volunteer.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: '#10B981'}]}>
              <Text style={styles.round48Text}>🤝</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{volunteer.name || volunteer.email}</Text>
              <Text style={styles.rowSubtitle}>{volunteer.email}</Text>
              <Text style={[styles.rowSubtitle, {marginTop: 4}]}>
                Status: {volunteer.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.smallBtn, {backgroundColor: volunteer.isActive ? '#DC2626' : '#16A34A'}]}
              onPress={() => handleToggleStatus(volunteer, !volunteer.isActive)}
            >
              <Text style={styles.smallBtnText}>
                {volunteer.isActive ? 'Deactivate' : 'Activate'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};
