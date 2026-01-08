import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';
import { getAllItems, matchItems } from '../../services/lostFoundService';

export const AdminLostFound = ({goHome, navigation}) => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

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
    : filter === 'lost' || filter === 'found'
      ? items.filter(item => item.type === filter)
      : items.filter(item => item.status === filter);

  const searchFiltered = searchText.trim()
    ? filtered.filter(item => {
        const searchLower = searchText.toLowerCase();
        const itemName = (item.itemName || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const address = (item.location?.address || '').toLowerCase();
        return itemName.includes(searchLower) || 
               description.includes(searchLower) || 
               address.includes(searchLower);
      })
    : filtered;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadItems} />}
    >
      <Header title="Lost & Found" icon="🔍" onBack={goHome} />
      
      {/* Search */}
      <View style={styles.card}>
        <View style={styles.searchRow}>
          <View style={styles.round40}><Text style={styles.round40Text}>🔍</Text></View>
          <TextInput
            style={[styles.searchInput, {flex: 1, color: '#7C2D12'}]}
            placeholder="Search lost & found items..."
            placeholderTextColor="#9A3412"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.round40}
              activeOpacity={0.7}
            >
              <Text style={styles.textOrange}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter */}
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
          <TouchableOpacity 
            onPress={() => setFilter('open')}
            style={[styles.chip, filter === 'open' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'open' && styles.chipTextActive]}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('matched')}
            style={[styles.chip, filter === 'matched' && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === 'matched' && styles.chipTextActive]}>Matched</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.card}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#FB923C" />
            <Text style={[styles.rowSubtitle, {marginTop: 12}]}>Loading items...</Text>
          </View>
        </View>
      ) : searchFiltered.length === 0 ? (
        <View style={styles.card}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={[styles.round64Text, {fontSize: 48, marginBottom: 12}]}>🔍</Text>
            <Text style={[styles.rowSubtitle, {textAlign: 'center'}]}>
              {searchText.trim() ? 'No items found matching your search' : 'No items found'}
            </Text>
          </View>
        </View>
      ) : (
        searchFiltered.map((item) => (
          <TouchableOpacity
            key={item._id || item.id}
            onPress={() => {
              if (navigation && navigation.navigate) {
                navigation.navigate('LostFoundDetails', { item });
              }
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 2,
              borderColor: item.type === 'lost' 
                ? '#F59E0B40'
                : '#10B98140',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: {width: 0, height: 2},
              elevation: 2,
            }}
          >
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <LinearGradient 
                colors={item.type === 'lost' ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: item.type === 'lost' ? '#F59E0B' : '#10B981',
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  shadowOffset: {width: 0, height: 3},
                  elevation: 3,
                }}
              >
                <Text style={{fontSize: 24, color: 'white'}}>
                  {item.type === 'lost' ? '🪔' : '🧿'}
                </Text>
              </LinearGradient>
              
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <Text style={[styles.rowTitle, {flex: 1, textTransform: 'capitalize'}]}>
                    {item.itemName || 'Unknown Item'}
                  </Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: item.status === 'open' 
                      ? '#FEF3C7' 
                      : item.status === 'matched'
                      ? '#DBEAFE'
                      : '#D1FAE5',
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: item.status === 'open' 
                        ? '#D97706' 
                        : item.status === 'matched'
                        ? '#1E40AF'
                        : '#065F46',
                      textTransform: 'capitalize',
                    }}>
                      {item.status || 'open'}
                    </Text>
                  </View>
                </View>
                
                {item.description && (
                  <Text 
                    style={[styles.rowSubtitle, {marginBottom: 6, lineHeight: 18}]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}
                
                {item.location && (
                  <Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]} numberOfLines={1}>
                    📍 {item.location.address || `${item.location.latitude?.toFixed(4)}, ${item.location.longitude?.toFixed(4)}`}
                  </Text>
                )}
                
                {item.reportedBy && (
                  <Text style={[styles.rowSubtitle, {fontSize: 10, color: '#9CA3AF', marginTop: 4}]}>
                    Reported by: {typeof item.reportedBy === 'object' 
                      ? (item.reportedBy.name || item.reportedBy.email || 'User')
                      : 'User'} • {formatDate(item.createdAt)}
                  </Text>
                )}
              </View>
              
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(251,146,60,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}>
                <Text style={{color: '#FB923C', fontSize: 18, fontWeight: '700'}}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

