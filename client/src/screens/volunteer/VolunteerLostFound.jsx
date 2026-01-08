import React, { useState, useEffect } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllItems, matchItems, reportItem } from '../../services/lostFoundService';
import { getCurrentPosition } from '../../utils/location';

export const VolunteerLostFound = ({goHome}) => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('lost');
  const [addItemName, setAddItemName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    try {
      const itemsData = await getAllItems();
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load lost & found items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  const handleMatch = async (lostId, foundId) => {
    Alert.alert(
      'Match Items',
      'Are you sure these items match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Match',
          onPress: async () => {
            try {
              await matchItems(lostId, foundId);
              await loadItems();
              Alert.alert('Success', 'Items matched successfully');
            } catch (error) {
              console.error('Match error:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to match items');
            }
          }
        }
      ]
    );
  };

  const handleAddEntry = (type) => {
    setAddType(type);
    setAddItemName('');
    setAddDescription('');
    setAddAddress('');
    setAddPhone('');
    setShowAddModal(true);
  };

  const handleSubmitEntry = async () => {
    if (!addItemName.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }
    if (!addPhone.trim()) {
      Alert.alert('Error', 'Contact phone is required');
      return;
    }

    setSubmitting(true);
    try {
      const location = await getCurrentPosition();
      
      await reportItem({
        type: addType,
        itemName: addItemName.trim(),
        description: addDescription.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        address: addAddress.trim(),
        phone: addPhone.trim(),
        email: '',
        images: [],
        isPerson: false
      });
      
      Alert.alert('Success', `${addType === 'lost' ? 'Lost' : 'Found'} item reported successfully`);
      setShowAddModal(false);
      setAddItemName('');
      setAddDescription('');
      setAddAddress('');
      setAddPhone('');
      await loadItems();
    } catch (error) {
      console.error('Report error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to report item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadItems} />}
    >
      <Header title="Lost & Found" icon="🔍" onBack={goHome} />
      
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.sectionTitle}>Lost & Found Items</Text>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Add New Entry',
                'Choose an option',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Report Lost Item', 
                    onPress: () => handleAddEntry('lost')
                  },
                  { 
                    text: 'Report Found Item', 
                    onPress: () => handleAddEntry('found')
                  }
                ]
              );
            }}
            style={[styles.smallBtn, {backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6}]}
          >
            <Text style={styles.smallBtnText}>+ Add Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filter Items</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity 
            onPress={() => setFilter('all')}
            style={[styles.chip, filter === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('lost')}
            style={[styles.chip, filter === 'lost' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'lost' && styles.chipTextActive]}>Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('found')}
            style={[styles.chip, filter === 'found' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'found' && styles.chipTextActive]}>Found</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>Loading...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>No items found</Text>
        </View>
      ) : (
        filtered.map((item) => (
          <View key={item._id || item.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: item.type === 'lost' ? '#F59E0B' : '#10B981'}]}>
              <Text style={styles.round48Text}>{item.type === 'lost' ? '🪔' : '🧿'}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{item.itemName || 'Unknown Item'}</Text>
              <Text style={styles.rowSubtitle}>
                {item.description || 'No description'} • Status: {item.status || 'open'}
              </Text>
              {item.location && (
                <Text style={[styles.rowSubtitle, {marginTop: 4, fontSize: 11}]}>
                  Location: {item.location.address || `${item.location.latitude}, ${item.location.longitude}`}
                </Text>
              )}
              {item.reportedBy && (
                <Text style={[styles.rowSubtitle, {marginTop: 2, fontSize: 10, color: '#6B7280'}]}>
                  Reported by: {typeof item.reportedBy === 'object' ? item.reportedBy.name || item.reportedBy.email : 'User'}
                </Text>
              )}
            </View>
            {item.status === 'open' && item.type === 'lost' && (
              <TouchableOpacity
                style={[styles.smallBtn, {backgroundColor: '#10B981'}]}
                onPress={() => {
                  const foundItem = filtered.find(f => f.type === 'found' && (f.itemName === item.itemName || f.description === item.description));
                  if (foundItem) {
                    handleMatch(item._id || item.id, foundItem._id || foundItem.id);
                  } else {
                    Alert.alert('No Match', 'No matching found item available');
                  }
                }}
              >
                <Text style={styles.smallBtnText}>Match</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      {/* Add Entry Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20}}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.sectionTitle}>
                {addType === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.textRedStrong}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                placeholder="E.g., Wallet, Bag, ID Card"
                placeholderTextColor="#9A3412"
                value={addItemName}
                onChangeText={setAddItemName}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                placeholder="Short description"
                placeholderTextColor="#9A3412"
                value={addDescription}
                onChangeText={setAddDescription}
                style={styles.textInput}
                multiline
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Location/Address</Text>
              <TextInput
                placeholder="Where was it lost/found?"
                placeholderTextColor="#9A3412"
                value={addAddress}
                onChangeText={setAddAddress}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Contact Phone *</Text>
              <TextInput
                placeholder="Your contact number"
                placeholderTextColor="#9A3412"
                value={addPhone}
                onChangeText={setAddPhone}
                style={styles.textInput}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, submitting && {opacity: 0.6}]}
              onPress={handleSubmitEntry}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryBtnText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
