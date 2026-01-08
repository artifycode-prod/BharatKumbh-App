import React, { useEffect, useState } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getAdminDashboard } from '../../services/adminService';
import { getUserName, getUserRole } from '../../services/authService';
import { getAllRegistrations } from '../../services/qrService';
import { styles } from '../../styles/styles';

export const AdminDashboard = ({goHome, navigate, onProfile, onSignOut}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);

  const loadDashboard = async () => {
    try {
      const [dashboardData, registrationData] = await Promise.all([
        getAdminDashboard().catch(() => null),
        getAllRegistrations(1, 1000).catch(() => ({ registrations: [], pagination: { total: 0, page: 1, limit: 1000, pages: 0 } })),
      ]);

      if (dashboardData) setDashboard(dashboardData);
      const regs = registrationData.registrations || [];
      setRegistrations(regs);
      
      // Calculate total registered users from all registrations
      // Sum up all groupSize values from registrations
      const totalUsers = regs.reduce((sum, reg) => sum + (parseInt(reg.groupSize) || 0), 0);
      setTotalRegisteredUsers(totalUsers);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <LinearGradient colors={['#60A5FA', '#3B82F6']} style={styles.brandBadge}>
              <Text style={styles.brandEmoji}>🔱</Text>
            </LinearGradient>
            <View style={{flex: 1}}>
              <Text style={styles.brandTitle}>Admin Dashboard</Text>
              <Text style={styles.brandSubtitle}>Administration Panel</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.homeContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <LinearGradient colors={['#60A5FA', '#3B82F6']} style={styles.brandBadge}>
            <Text style={styles.brandEmoji}>🔱</Text>
          </LinearGradient>
          <View style={{flex: 1}}>
            <Text style={styles.brandTitle}>Admin Dashboard</Text>
            <Text style={styles.brandSubtitle}>Administration Panel</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={onProfile || (() => setShowProfileModal(true))} 
              activeOpacity={0.8}
              style={styles.headerBtn}
            >
              <Text style={styles.textOrange}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Statistics Cards */}
      <Text style={styles.sectionTitle}>Dashboard Overview</Text>
      <View style={styles.grid}>
        <StatCard 
          emoji="📱" 
          value={totalRegisteredUsers} 
          label="Registered Pilgrims" 
          colors={['#3B82F6', '#2563EB']}
          onPress={() => navigate && navigate('Registrations')}
        />
        <StatCard 
          emoji="📊" 
          value={registrations.length} 
          label="Total Registrations" 
          colors={['#A78BFA', '#8B5CF6']}
          onPress={() => navigate && navigate('Registrations')}
        />
        <StatCard 
          emoji="🔍" 
          value={dashboard?.lostFound?.open || 0} 
          label="Lost & Found" 
          colors={['#FCD34D', '#CA8A04']}
          onPress={() => navigate && navigate('LostFound')}
        />
        <StatCard 
          emoji="🏥" 
          value={dashboard?.medical?.pending || 0} 
          label="Medical Emergencies" 
          colors={['#FCA5A5', '#F87171']}
          onPress={() => navigate && navigate('MedicalEmergencies')}
        />
      </View>

      {/* Recent Activity */}
      <View style={[styles.card, {marginTop: 12}]}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {registrations.length > 0 ? (
          <>
            {registrations.slice(0, 5).map((reg) => (
              <View key={reg._id || reg.id} style={styles.listRow}>
                <View style={[styles.round40, {backgroundColor: '#3B82F6'}]}>
                  <Text style={styles.round40Text}>📱</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.rowTitle}>{reg.intendedDestination || 'Unknown Destination'}</Text>
                  <Text style={styles.rowSubtitle}>
                    Group: {reg.groupSize || 'N/A'} people • Entry: {reg.entryPointName || reg.entryPoint || 'N/A'}
                  </Text>
                  {reg.registeredAt && (
                    <Text style={[styles.rowSubtitle, {fontSize: 10, marginTop: 2, color: '#9A3412'}]}>
                      {new Date(reg.registeredAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            {registrations.length > 5 && (
              <TouchableOpacity 
                onPress={() => navigate && navigate('Registrations')}
                style={{marginTop: 8, alignItems: 'center'}}
              >
                <Text style={styles.linkText}>View All Registrations →</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.rowSubtitle}>No recent registrations</Text>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Statistics</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8}}>
          <View style={{width: '48%', marginBottom: 12, padding: 8, backgroundColor: 'rgba(255,153,51,0.05)', borderRadius: 12}}>
            <Text style={[styles.rowSubtitle, {fontSize: 11}]}>Total Users</Text>
            <Text style={[styles.rowTitle, {fontSize: 20, marginTop: 4}]}>
              {dashboard?.users?.total || 0}
            </Text>
          </View>
          <View style={{width: '48%', marginBottom: 12, padding: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 12}}>
            <Text style={[styles.rowSubtitle, {fontSize: 11}]}>Volunteers</Text>
            <Text style={[styles.rowTitle, {fontSize: 20, marginTop: 4, color: '#10B981'}]}>
              {dashboard?.users?.volunteers || 0}
            </Text>
          </View>
          <View style={{width: '48%', marginBottom: 12, padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12}}>
            <Text style={[styles.rowSubtitle, {fontSize: 11}]}>Medical Staff</Text>
            <Text style={[styles.rowTitle, {fontSize: 20, marginTop: 4, color: '#EF4444'}]}>
              {dashboard?.users?.medicalStaff || 0}
            </Text>
          </View>
          <View style={{width: '48%', marginBottom: 12, padding: 8, backgroundColor: 'rgba(22, 163, 74, 0.1)', borderRadius: 12}}>
            <Text style={[styles.rowSubtitle, {fontSize: 11}]}>Resolved SOS</Text>
            <Text style={[styles.rowTitle, {fontSize: 20, marginTop: 4, color: '#16A34A'}]}>
              {dashboard?.sos?.resolved || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20}}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text style={styles.textRedStrong}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardCenter}>
              <LinearGradient colors={['#60A5FA', '#3B82F6']} style={[styles.round64, {shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: {width: 0, height: 8}, shadowRadius: 16, elevation: 6}]}>
                <Text style={styles.round64Text}>🔱</Text>
              </LinearGradient>
              <Text style={[styles.authTitle, {marginTop: 12}]}>{userName || 'Admin'}</Text>
              <Text style={styles.smallMutedCenter}>Administrator</Text>
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, {backgroundColor: '#DC2626', marginTop: 16}]}
              onPress={async () => {
                setShowProfileModal(false);
                if (onSignOut) {
                  await onSignOut();
                }
              }}
            >
              <Text style={styles.primaryBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const StatCard = ({emoji, value, label, colors, onPress}) => {
  const gradientColors = colors || ['#FFB74D', '#FF9800'];
  
  const CardContent = (
    <>
      <LinearGradient colors={gradientColors} style={styles.tileBadge}>
        <Text style={styles.tileEmoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.tileTitle}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      <Text style={styles.tileSubtitle}>{label}</Text>
    </>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.8}
        style={styles.tile}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.tile}>
      {CardContent}
    </View>
  );
};
