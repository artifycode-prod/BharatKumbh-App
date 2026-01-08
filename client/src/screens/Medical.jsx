import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../components/Header';
import { createCase } from '../services/medicalService';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

export const Medical = ({goHome}) => {
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

        Alert.alert('Emergency Alert Sent', 'Medical team has been notified and is on the way!', [
          {text: 'OK', onPress: goHome}
        ]);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to send emergency alert');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send emergency alert');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !medicalIssue.trim()) {
      Alert.alert('Required Fields', 'Please fill in at least Name and Medical Issue');
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

      Alert.alert('Medical Request Submitted', 'Your details have been shared with the medical team.', [
        {text: 'OK', onPress: () => {
          setName('');
          setAge('');
          setMedicalIssue('');
          setAllergies('');
          setEmergencyContact('');
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit medical request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Medical Assistance" icon="🚑" accent="red" onBack={goHome} />
      
      <View style={styles.cardCenter}>
        <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.bigRoundBtn}>
          <Text style={styles.bigRoundText}>🚨</Text>
        </LinearGradient>
        <Text style={[styles.sectionTitle, styles.textRedStrong, {marginTop: 12}]}>Emergency Medical</Text>
        <Text style={[styles.rowSubtitle, {marginTop: 4, textAlign: 'center'}]}>Fill in the details below to request medical assistance</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>👤 Full Name *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full name"
            placeholderTextColor="#9A3412"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>🎂 Age</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter age"
            placeholderTextColor="#9A3412"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>🏥 Medical Issue *</Text>
          <TextInput
            style={[styles.textInput, {height: 90, textAlignVertical: 'top', paddingTop: 12}]}
            placeholder="Describe your medical concern"
            placeholderTextColor="#9A3412"
            value={medicalIssue}
            onChangeText={setMedicalIssue}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>⚠️ Known Allergies</Text>
          <TextInput
            style={styles.textInput}
            placeholder="List any allergies (if any)"
            placeholderTextColor="#9A3412"
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>📞 Emergency Contact</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Emergency contact phone number"
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
          <Text style={styles.primaryBtnText}>🏥 Submit Medical Request</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
};


