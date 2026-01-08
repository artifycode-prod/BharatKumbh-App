import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllSOS } from '../../services/sosService';

export const AdminTasks = ({goHome}) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      const sosAlerts = await getAllSOS();
      setTasks(sosAlerts);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
    >
      <Header title="Tasks" icon="📋" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter Tasks</Text>
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
      ) : filteredTasks.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No tasks found</Text>
        </View>
      ) : (
        filteredTasks.map((task) => (
          <View key={task._id || task.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: getPriorityColor(task.priority)}]}>
              <Text style={styles.round48Text}>🚨</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>SOS Alert</Text>
              <Text style={styles.rowSubtitle}>
                Priority: {task.priority} • Status: {task.status}
              </Text>
              {task.message && (
                <Text style={[styles.rowSubtitle, {marginTop: 4}]}>{task.message}</Text>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
