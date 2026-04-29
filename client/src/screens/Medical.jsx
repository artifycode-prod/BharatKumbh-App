import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { createCase } from '../services/medicalService';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

export const Medical = ({goHome}) => {
  const { t, currentLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [medicalIssue, setMedicalIssue] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmergencyCall = async () => {
    try {
      setLoading(true);
      
      // Get location
      const location = await getCurrentPosition();
      
      try {
        await createCase({
          patientName: name || 'Emergency Patient',
          patientAge: age ? parseInt(age) : undefined,
          caseType: 'emergency',
          description: 'Emergency medical assistance requested',
          medicalIssue: medicalIssue || 'Emergency',
          allergies: allergies || '',
          emergencyContact: emergencyContact || '',
          severity: 'critical',
          latitude: location.latitude,
          longitude: location.longitude,
        });

        Alert.alert(t('emergencyAlertSent'), t('medicalTeamNotified'), [
          {text: t('ok'), onPress: goHome}
        ]);
      } catch (error) {
        Alert.alert(t('error'), error.message || t('failedToSendEmergency'));
      } finally {
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(t('error'), error.message || t('failedToSendEmergency'));
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !medicalIssue.trim()) {
      Alert.alert(t('requiredFields'), t('fillNameAndMedical'));
      return;
    }

    setLoading(true);

    try {
      // Get location
      const location = await getCurrentPosition();
      
      await createCase({
        patientName: name,
        patientAge: age ? parseInt(age) : undefined,
        caseType: 'consultation',
        description: medicalIssue,
        medicalIssue: medicalIssue,
        allergies: allergies || '',
        emergencyContact: emergencyContact || '',
        severity: 'medium',
        latitude: location.latitude,
        longitude: location.longitude,
      });

      Alert.alert(t('medicalRequestSubmitted'), t('medicalDetailsShared'), [
        {text: t('ok'), onPress: () => {
          setName('');
          setAge('');
          setMedicalIssue('');
          setAllergies('');
          setEmergencyContact('');
        }}
      ]);
    } catch (error) {
      Alert.alert(t('error'), error.message || t('failedToSubmitMedical'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      
      <View style={[styles.cardCenter, { flex: 0 }]} key={currentLanguage}>
        <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.bigRoundBtn}>
          <Text style={styles.bigRoundText}>🚨</Text>
        </LinearGradient>
        <Text style={[styles.sectionTitle, styles.textRedStrong, {marginTop: 12}]}>{t('emergencyMedical')}</Text>
        <Text style={[styles.rowSubtitle, {marginTop: 4, textAlign: 'center'}]}>{t('medicalRequestFillDetails')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('patientInformation')}</Text>
        
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>👤 {t('fullName')} *</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('enterFullNameLetters')}
            placeholderTextColor="#9A3412"
            value={name}
            onChangeText={(text) => setName(text.replace(/[^a-zA-Z\s\u0900-\u097F]/g, ''))}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>🎂 {t('age')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('enterAge2Digits')}
            placeholderTextColor="#9A3412"
            value={age}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '');
              if (digits.length <= 2) setAge(digits);
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>🏥 {t('medicalIssue')} *</Text>
          <TextInput
            style={[styles.textInput, {height: 90, textAlignVertical: 'top', paddingTop: 12}]}
            placeholder={t('describeMedicalConcern')}
            placeholderTextColor="#9A3412"
            value={medicalIssue}
            onChangeText={(text) => setMedicalIssue(text.replace(/[0-9]/g, ''))}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>⚠️ {t('knownAllergies')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('listAllergies')}
            placeholderTextColor="#9A3412"
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>📞 {t('emergencyContact')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('emergencyContactPlaceholder')}
            placeholderTextColor="#9A3412"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, loading && {opacity: 0.6}]}
        activeOpacity={0.9}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryBtnText}>🏥 {t('submitMedicalRequest')}</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
};


