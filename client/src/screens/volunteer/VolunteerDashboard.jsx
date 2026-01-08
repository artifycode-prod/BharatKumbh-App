import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getVolunteerDashboard, getAssignedTasks } from '../../services/volunteerService';
import { getUserName, getUserRole } from '../../services/authService';

export const VolunteerDashboard = ({goHome, navigate, onProfile, onSignOut}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const loadDashboard = async () => {
    try {
      const [dashboardData, tasksData] = await Promise.all([
        getVolunteerDashboard().catch(() => null),
        getAssignedTasks().catch(() => [])
      ]);
      
      if (dashboardData) setDashboard(dashboardData);
      setTasks(tasksData);
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

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadDashboard} />}
    >
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <LinearGradient colors={['#34D399', '#10B981']} style={styles.brandBadge}>
            <Text style={styles.brandEmoji}>🤝</Text>
          </LinearGradient>
          <View style={{flex: 1}}>
            <Text style={styles.brandTitle}>Volunteer Dashboard</Text>
            <Text style={styles.brandSubtitle}>Service & Support</Text>
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

      {/* Statistics */}
      {dashboard && (
        <View style={styles.grid}>
          <StatCard emoji="🚨" value={dashboard.pendingSOS || 0} label="Pending SOS" color="#DC2626" />
          <StatCard emoji="📋" value={dashboard.myAssignedSOS || 0} label="My Tasks" color="#3B82F6" />
          <StatCard emoji="🔍" value={dashboard.openLostFound || 0} label="Lost/Found" color="#CA8A04" />
        </View>
      )}

      {/* Assigned Tasks */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Assigned Tasks</Text>
        {tasks.length === 0 ? (
          <Text style={styles.rowSubtitle}>No tasks assigned</Text>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <View key={task._id || task.id} style={styles.listRow}>
              <View style={[styles.round48, {backgroundColor: getPriorityColor(task.priority)}]}>
                <Text style={styles.round48Text}>📋</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.rowTitle}>Task</Text>
                <Text style={styles.rowSubtitle}>
                  Priority: {task.priority} • Status: {task.status}
                </Text>
                {task.message && (
                  <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                    {task.message}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

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
              <LinearGradient colors={['#34D399', '#10B981']} style={[styles.round64, {shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: {width: 0, height: 8}, shadowRadius: 16, elevation: 6}]}>
                <Text style={styles.round64Text}>🤝</Text>
              </LinearGradient>
              <Text style={[styles.authTitle, {marginTop: 12}]}>{userName || 'Volunteer'}</Text>
              <Text style={styles.smallMutedCenter}>Volunteer</Text>
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

const StatCard = ({emoji, value, label, color}) => (
  <View style={[styles.statCard, {borderColor: '#EA580C'}]}>
    <View style={[styles.round48, {backgroundColor: color}]}>
      <Text style={styles.round48Text}>{emoji}</Text>
    </View>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const getPriorityColor = (priority) => {
  const colors = {
    critical: '#DC2626',
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };
  return colors[priority] || '#6B7280';
};
