import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllItems, reportItem } from '../services/lostFoundService';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

export const Lost = ({goHome, navigation: navProp}) => {
  const { t } = useLanguage();
  // Try to get navigation from hook first, fallback to prop
  let navigationHook;
  try {
    navigationHook = useNavigation();
  } catch (e) {
    // useNavigation might not work if not in NavigationContainer context
    console.log('useNavigation hook not available, using prop');
  }
  const navigation = navigationHook || navProp;
  
  // Debug: Log navigation availability
  useEffect(() => {
    console.log('Lost screen - Navigation available:', !!navigation);
    console.log('Lost screen - Navigation has navigate:', !!(navigation && navigation.navigate));
  }, [navigation]);
  const [mode, setMode] = React.useState('lost');
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [pickerMode, setPickerMode] = React.useState('date'); // 'date' or 'time'
  const [contact, setContact] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [recentReports, setRecentReports] = React.useState([]);
  const [allReports, setAllReports] = React.useState([]); // Store all reports for filtering
  const [loadingReports, setLoadingReports] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const handleSubmit = async () => {
    const missing = [];
    if (!title.trim()) missing.push(mode === 'lost' ? t('whatIsLost') : t('whatIsFound'));
    if (!desc.trim()) missing.push(t('description'));
    if (!place.trim()) missing.push(mode === 'lost' ? t('whereLost') : t('whereFound'));
    if (!contact.trim()) missing.push(t('contactPhone'));
    
    if (missing.length) {
      Alert.alert(t('pleaseFillRequired'), missing.join('\n'));
      return;
    }

    setLoading(true);
    try {
      // Get current location
      const location = await getCurrentPosition();
      
      // Convert photos to base64 or URIs
      const imageUris = photos.map(photo => photo.uri || photo.base64 || '').filter(uri => uri);

      // Prepare data for API
      const reportData = {
        type: mode,
        itemName: title.trim(),
        description: desc.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        address: place.trim(),
        phone: contact.trim(),
        email: '',
        images: imageUris,
        isPerson: false
      };

      await reportItem(reportData);
      
      // Reload recent reports after successful submission
      loadRecentReports();
      
      Alert.alert(t('success'), mode === 'lost' ? t('lostReportSubmitted') : t('foundReportSubmitted'), [
        { text: 'OK', onPress: () => {
          setTitle('');
          setDesc('');
          setPlace('');
          setDate(new Date());
          setContact('');
          setPhotos([]);
        }}
      ]);
    } catch (error) {
      console.error('Report submission error:', error);
      let errorMessage = t('failedToSubmitReport');
      const data = error?.response?.data;
      if (data?.message) errorMessage = data.message;
      else if (error?.message) errorMessage = error.message;
      else if (error?.response) errorMessage = `Server error: ${error.response.status}`;
      Alert.alert(t('submissionFailed'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromCamera = async () => {
    const res = await launchCamera({mediaType: 'photo', quality: 0.8, saveToPhotos: false});
    if (res?.assets && res.assets.length > 0) {
      setPhotos(prev => [...prev, ...(res.assets ?? [])]);
    }
  };

  const handleAddFromGallery = async () => {
    const res = await launchImageLibrary({mediaType: 'photo', selectionLimit: 5, quality: 0.8});
    if (res?.assets && res.assets.length > 0) {
      setPhotos(prev => [...prev, ...(res.assets ?? [])]);
    }
  };

  const loadRecentReports = React.useCallback(async () => {
    try {
      setLoadingReports(true);
      const allItems = await getAllItems();
      // Store all items for filtering
      setAllReports(allItems);
      
      // Filter by current mode
      const filteredByMode = allItems.filter(item => item.type === mode);
      
      // Apply search filter if searchText exists
      let filtered = filteredByMode;
      if (searchText.trim()) {
        const searchLower = searchText.toLowerCase().trim();
        filtered = filteredByMode.filter(item => {
          const itemName = (item.itemName || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          const address = (item.location?.address || '').toLowerCase();
          return itemName.includes(searchLower) || 
                 description.includes(searchLower) || 
                 address.includes(searchLower);
        });
      }
      
      // Sort by date and show all items
      const sorted = filtered
        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
      
      setRecentReports(sorted);
    } catch (error) {
      console.error('Error loading recent reports:', error);
      // Don't show error alert, just log it
    } finally {
      setLoadingReports(false);
      setRefreshing(false);
    }
  }, [mode, searchText]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRecentReports();
  };

  // Load reports when component mounts, mode changes, or search text changes
  useEffect(() => {
    loadRecentReports();
  }, [loadRecentReports]);
  
  // Also filter existing reports when search text changes (for instant filtering)
  useEffect(() => {
    if (allReports.length > 0) {
      // Filter by current mode
      let filtered = allReports.filter(item => item.type === mode);
      
      // Apply search filter if searchText exists
      if (searchText.trim()) {
        const searchLower = searchText.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const itemName = (item.itemName || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          const address = (item.location?.address || '').toLowerCase();
          return itemName.includes(searchLower) || 
                 description.includes(searchLower) || 
                 address.includes(searchLower);
        });
      }
      
      // Sort by date and show all items
      const sorted = filtered
        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
      
      setRecentReports(sorted);
    }
  }, [searchText, mode, allReports]);

  const formatDate = (dateString) => {
    if (!dateString) return t('recently');
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    if (diffDays === 1) return t('yesterday');
    if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.screenPad}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      {/* Toggle */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('chooseOption')}</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity onPress={() => setMode('lost')} activeOpacity={0.9} style={[styles.chip, mode === 'lost' && styles.chipActive]}>
            <Text style={mode === 'lost' ? styles.chipTextActive : styles.chipText}>{t('lost')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('found')} activeOpacity={0.9} style={[styles.chip, mode === 'found' && styles.chipActive]}>
            <Text style={mode === 'found' ? styles.chipTextActive : styles.chipText}>{t('found')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.card}>
        <View style={styles.searchRow}>
          <View style={styles.round40}><Text style={styles.round40Text}>{mode === 'lost' ? '🪔' : '🧿'}</Text></View>
          <TextInput
            style={[styles.searchInput, {flex: 1, color: '#7C2D12'}]}
            placeholder={mode === 'lost' ? t('searchLostReports') : t('searchFoundReports')}
            placeholderTextColor="#9A3412"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
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
          <View style={styles.round40}><Text style={styles.textOrange}>🔍</Text></View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{mode === 'lost' ? t('addLostDetails') : t('addFoundDetails')}</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>{mode === 'lost' ? t('whatIsLost') : t('whatIsFound')}</Text>
          <TextInput placeholder={mode === 'lost' ? t('egWalletPerson') : t('egBagIdCard')} placeholderTextColor="#9A3412" value={title} onChangeText={setTitle} style={styles.textInput} />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>{t('description')}</Text>
          <TextInput placeholder={t('shortDescription')} placeholderTextColor="#9A3412" value={desc} onChangeText={setDesc} style={styles.textInput} />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>{mode === 'lost' ? t('whereLost') : t('whereFound')}</Text>
          <TextInput placeholder={t('locationOrLandmark')} placeholderTextColor="#9A3412" value={place} onChangeText={setPlace} style={styles.textInput} />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>{t('dateAndTime')}</Text>
          <View style={{flexDirection: 'row', gap: 8}}>
            <TouchableOpacity 
              onPress={() => {
                setPickerMode('date');
                setShowDatePicker(true);
              }}
              style={[styles.textInput, {flex: 1}]}
              activeOpacity={0.7}
            >
              <Text style={{color: date ? '#7C2D12' : '#9A3412'}}>
                {date ? date.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : t('selectDate')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                setPickerMode('time');
                setShowDatePicker(true);
              }}
              style={[styles.textInput, {flex: 1}]}
              activeOpacity={0.7}
            >
              <Text style={{color: date ? '#7C2D12' : '#9A3412'}}>
                {date ? date.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) : t('selectTime')}
              </Text>
            </TouchableOpacity>
          </View>
          <DatePicker
            modal
            open={showDatePicker}
            date={date}
            mode={pickerMode}
            onConfirm={(selectedDate) => {
              setShowDatePicker(false);
              if (pickerMode === 'date') {
                // Update date but keep the time
                const newDate = new Date(selectedDate);
                newDate.setHours(date.getHours());
                newDate.setMinutes(date.getMinutes());
                setDate(newDate);
                // Show time picker after date selection
                setTimeout(() => {
                  setPickerMode('time');
                  setShowDatePicker(true);
                }, 300);
              } else {
                // Update time but keep the date
                const newDate = new Date(date);
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
                setDate(newDate);
              }
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
            theme="light"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>{t('contactPhoneRequired')}</Text>
          <TextInput 
            placeholder={t('yourContactPhone')} 
            placeholderTextColor="#9A3412" 
            value={contact} 
            onChangeText={setContact} 
            style={styles.textInput}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={[styles.inputLabel, {marginTop: 6}]}>{t('photos')}</Text>
        <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
          <TouchableOpacity onPress={handleAddFromCamera} activeOpacity={0.9}>
            <View style={styles.round64Light}><Text style={styles.round64Text}>📷</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddFromGallery} activeOpacity={0.9}>
            <View style={styles.round64Light}><Text style={styles.round64Text}>🖼️</Text></View>
          </TouchableOpacity>
        </View>
        {photos.length > 0 && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8}}>
            {photos.map((a, idx) => (
              <Image key={`${a.uri}-${idx}`} source={{uri: a.uri}} style={{width: 64, height: 64, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)'}} />
            ))}
          </View>
        )}
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={[styles.primaryBtn, loading && {opacity: 0.6}]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryBtnText}>{mode === 'lost' ? t('submitLostReport') : t('submitFoundReport')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Reports Section */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.sectionTitle}>
            {searchText.trim() 
              ? `${t('searchResults')} (${recentReports.length})` 
              : mode === 'lost' ? t('recentLostReports') : t('recentFoundReports')}
          </Text>
          {loadingReports && <ActivityIndicator size="small" color="#F59E0B" />}
        </View>
        
        {loadingReports && recentReports.length === 0 ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={[styles.rowSubtitle, {marginTop: 10}]}>{t('loadingReports')}</Text>
          </View>
        ) : recentReports.length === 0 ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={[styles.rowSubtitle, {textAlign: 'center'}]}>
              {mode === 'lost' ? t('noLostReportsYet') : t('noFoundReportsYet')}{'\n'}{t('beFirstToSubmit')}
            </Text>
          </View>
        ) : (
          recentReports.map((item, index) => (
            <TouchableOpacity 
              key={item._id || item.id || index} 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: 'rgba(251,146,60,0.25)',
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: {width: 0, height: 2},
                elevation: 2,
              }}
              activeOpacity={0.7}
              onPress={() => {
                console.log('Report item clicked:', item.itemName);
                console.log('Navigation object:', navigation);
                try {
                  if (navigation && navigation.navigate) {
                    console.log('Navigating to LostFoundDetails');
                    navigation.navigate('LostFoundDetails', { item });
                  } else {
                    console.error('Navigation not available or navigate method missing');
                    Alert.alert(t('error'), t('navigationNotAvailable'));
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                  Alert.alert(t('error'), t('failedToSubmitReport') + ': ' + error.message);
                }
              }}
            >
              <View style={{flex: 1, marginRight: 12}}>
                <Text style={[styles.rowTitle, {marginBottom: 4}]}>
                  {item.itemName || t('unknownItem')}
                </Text>
                <Text 
                  style={[styles.rowSubtitle, {marginBottom: 6}]} 
                  numberOfLines={2}
                >
                  {item.description || t('noDescription')}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                  <Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]}>
                    {formatDate(item.createdAt || item.created_at)}
                  </Text>
                  {item.location?.address && (
                    <>
                      <Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280', marginHorizontal: 6}]}>
                        •
                      </Text>
                      <Text 
                        style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]}
                        numberOfLines={1}
                      >
                        {item.location.address}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(251,146,60,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{color: '#FB923C', fontSize: 18, fontWeight: '700'}}>→</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

