import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAdminDashboard } from '../../services/adminService';
import { getAllSOS } from '../../services/sosService';
import { getAllCases } from '../../services/medicalService';
import { getAllItems } from '../../services/lostFoundService';

export const AdminReports = ({goHome}) => {
  const [dashboard, setDashboard] = useState(null);
  const [sosStats, setSosStats] = useState({ pending: 0, resolved: 0 });
  const [medicalStats, setMedicalStats] = useState({ pending: 0, resolved: 0 });
  const [lostFoundStats, setLostFoundStats] = useState({ open: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    try {
      const [dashboardData, sosData, medicalData, lostFoundData] = await Promise.all([
        getAdminDashboard().catch(() => null),
        getAllSOS().catch(() => []),
        getAllCases().catch(() => []),
        getAllItems().catch(() => [])
      ]);

      if (dashboardData) {
        setDashboard(dashboardData);
      }

      const pendingSOS = sosData.filter(s => s.status === 'pending').length;
      const resolvedSOS = sosData.filter(s => s.status === 'resolved').length;
      setSosStats({ pending: pendingSOS, resolved: resolvedSOS });

      const pendingMedical = medicalData.filter(m => m.status === 'pending').length;
      const resolvedMedical = medicalData.filter(m => m.status === 'resolved').length;
      setMedicalStats({ pending: pendingMedical, resolved: resolvedMedical });

      const openLostFound = lostFoundData.filter(l => l.status === 'open').length;
      const resolvedLostFound = lostFoundData.filter(l => l.status === 'resolved' || l.status === 'matched').length;
      setLostFoundStats({ open: openLostFound, resolved: resolvedLostFound });
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadReports} />}
    >
      <Header title="Reports" icon="📊" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Statistics</Text>
        {dashboard && (
          <>
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Total Users:</Text>
              <Text style={styles.kvValueDark}>{dashboard.users?.total || 0}</Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Volunteers:</Text>
              <Text style={styles.kvValueDark}>{dashboard.users?.volunteers || 0}</Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvLabelDark}>Medical Staff:</Text>
              <Text style={styles.kvValueDark}>{dashboard.users?.medicalStaff || 0}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>SOS Alerts</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Pending:</Text>
          <Text style={styles.kvValueDark}>{sosStats.pending}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Resolved:</Text>
          <Text style={styles.kvValueDark}>{sosStats.resolved}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Medical Cases</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Pending:</Text>
          <Text style={styles.kvValueDark}>{medicalStats.pending}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Resolved:</Text>
          <Text style={styles.kvValueDark}>{medicalStats.resolved}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lost & Found</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Open:</Text>
          <Text style={styles.kvValueDark}>{lostFoundStats.open}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Resolved:</Text>
          <Text style={styles.kvValueDark}>{lostFoundStats.resolved}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
