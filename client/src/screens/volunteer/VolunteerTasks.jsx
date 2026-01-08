import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAssignedTasks } from '../../services/volunteerService';
import { acknowledgeSOS, resolveSOS } from '../../services/sosService';

export const VolunteerTasks = ({goHome}) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      const tasksData = await getAssignedTasks();
      setTasks(tasksData);
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
    : filter === 'assigned'
      ? tasks.filter(t => t.status === 'pending')
      : filter === 'in-progress'
        ? tasks.filter(t => t.status === 'acknowledged')
        : tasks.filter(t => t.status === 'resolved');

  const handleAcknowledge = async (taskId) => {
    try {
      await acknowledgeSOS(taskId);
      await loadTasks();
      Alert.alert('Success', 'Task acknowledged');
    } catch (error) {
      Alert.alert('Error', 'Failed to acknowledge task');
    }
  };

  const handleResolve = async (taskId) => {
    Alert.alert(
      'Resolve Task',
      'Are you sure this task is completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await resolveSOS(taskId);
              await loadTasks();
              Alert.alert('Success', 'Task resolved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to resolve task');
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
    >
      <Header title="Volunteer Tasks" icon="📋" onBack={goHome} />
      
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
            onPress={() => setFilter('assigned')}
            style={[styles.chip, filter === 'assigned' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'assigned' && styles.chipTextActive]}>Assigned</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('in-progress')}
            style={[styles.chip, filter === 'in-progress' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'in-progress' && styles.chipTextActive]}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('completed')}
            style={[styles.chip, filter === 'completed' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'completed' && styles.chipTextActive]}>Completed</Text>
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
              {task.location && (
                <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                  Location: {task.location.address || `${task.location.latitude}, ${task.location.longitude}`}
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'column', gap: 4}}>
              {task.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.smallBtn, {backgroundColor: '#3B82F6'}]}
                  onPress={() => handleAcknowledge(task._id || task.id)}
                >
                  <Text style={styles.smallBtnText}>Accept</Text>
                </TouchableOpacity>
              )}
              {task.status === 'acknowledged' && (
                <TouchableOpacity
                  style={[styles.smallBtn, {backgroundColor: '#16A34A'}]}
                  onPress={() => handleResolve(task._id || task.id)}
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
