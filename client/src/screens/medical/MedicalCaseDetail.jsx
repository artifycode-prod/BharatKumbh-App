import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Linking, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';

export const MedicalCaseDetail = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { caseData } = route.params || {};

  if (!caseData) {
    return (
      <View style={styles.container}>
        <Header title={t('caseDetails')} icon="🚑" accent="red" onBack={() => navigation.goBack()} />
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>{t('caseDataNotFound')}</Text>
        </View>
      </View>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    return colors[severity] || '#6B7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      'in-progress': '#3B82F6',
      resolved: '#16A34A',
      referred: '#8B5CF6'
    };
    return colors[status] || '#6B7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openLocation = () => {
    const { latitude, longitude } = caseData.location || {};
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title={t('caseDetails')} icon="🚑" accent="red" onBack={() => navigation.goBack()} />

      {/* Patient Info Card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <LinearGradient colors={[getSeverityColor(caseData.severity), getSeverityColor(caseData.severity) + 'CC']} style={styles.brandBadge}>
            <Text style={styles.brandEmoji}>🚑</Text>
          </LinearGradient>
          <View style={{flex: 1}}>
            <Text style={styles.brandTitle}>{caseData.patientName || t('unknownPatient')}</Text>
            <Text style={styles.brandSubtitle}>
              {caseData.patientAge ? `${t('ageLabel')}: ${caseData.patientAge}` : t('ageNotSpecified')}
              {caseData.patientGender ? ` • ${caseData.patientGender}` : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Badges */}
      <View style={{flexDirection: 'row', gap: 8, marginBottom: 16}}>
        <View style={[styles.chip, {backgroundColor: getSeverityColor(caseData.severity) + '20', borderWidth: 1, borderColor: getSeverityColor(caseData.severity)}]}>
          <Text style={[styles.chipText, {color: getSeverityColor(caseData.severity), fontWeight: '700'}]}>
            {caseData.severity?.toUpperCase() || 'MEDIUM'}
          </Text>
        </View>
        <View style={[styles.chip, {backgroundColor: getStatusColor(caseData.status) + '20', borderWidth: 1, borderColor: getStatusColor(caseData.status)}]}>
          <Text style={[styles.chipText, {color: getStatusColor(caseData.status), fontWeight: '700'}]}>
            {caseData.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
          </Text>
        </View>
        <View style={[styles.chip, {backgroundColor: '#6B728020', borderWidth: 1, borderColor: '#6B7280'}]}>
          <Text style={[styles.chipText, {color: '#6B7280', fontWeight: '700'}]}>
            {caseData.caseType?.toUpperCase() || 'CONSULTATION'}
          </Text>
        </View>
      </View>

      {/* Case Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Case Information</Text>
        
        <DetailRow label="Case Type" value={caseData.caseType || 'N/A'} icon="📋" />
        <DetailRow label="Description" value={caseData.description || 'No description'} icon="📝" multiline />
        {caseData.medicalIssue && (
          <DetailRow label="Medical Issue" value={caseData.medicalIssue} icon="🏥" multiline />
        )}
        {caseData.allergies && (
          <DetailRow label="Known Allergies" value={caseData.allergies} icon="⚠️" />
        )}
        {caseData.symptoms && caseData.symptoms.length > 0 && (
          <View style={{marginBottom: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
              <Text style={{fontSize: 16, marginRight: 6}}>🤒</Text>
              <Text style={styles.inputLabel}>Symptoms</Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 6}}>
              {caseData.symptoms.map((symptom, index) => (
                <View key={index} style={[styles.chip, {backgroundColor: '#FEF3C7'}]}>
                  <Text style={[styles.chipText, {color: '#92400E'}]}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Contact Information */}
      {(caseData.emergencyContact || caseData.patientId?.phone) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {caseData.emergencyContact && (
            <DetailRow label="Emergency Contact" value={caseData.emergencyContact} icon="📞" />
          )}
          {caseData.patientId?.phone && (
            <DetailRow label="Patient Phone" value={caseData.patientId.phone} icon="📱" />
          )}
          {caseData.patientId?.email && (
            <DetailRow label="Patient Email" value={caseData.patientId.email} icon="✉️" />
          )}
        </View>
      )}

      {/* Location Information */}
      {caseData.location && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          {caseData.location.address && (
            <DetailRow label="Address" value={caseData.location.address} icon="📍" multiline />
          )}
          <View style={{marginBottom: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
              <Text style={{fontSize: 16, marginRight: 6}}>🗺️</Text>
              <Text style={styles.inputLabel}>Coordinates</Text>
            </View>
            <Text style={[styles.rowSubtitle, {marginBottom: 8}]}>
              Lat: {caseData.location.latitude?.toFixed(6)}, Long: {caseData.location.longitude?.toFixed(6)}
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, {backgroundColor: '#3B82F6', marginTop: 4}]}
              onPress={openLocation}
            >
              <Text style={styles.primaryBtnText}>🗺️ Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Assignment Information */}
      {caseData.assignedTo && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Assigned To</Text>
          <DetailRow label="Staff Name" value={caseData.assignedTo.name || 'N/A'} icon="👨‍⚕️" />
          {caseData.assignedTo.email && (
            <DetailRow label="Email" value={caseData.assignedTo.email} icon="✉️" />
          )}
          {caseData.assignedTo.phone && (
            <DetailRow label="Phone" value={caseData.assignedTo.phone} icon="📞" />
          )}
        </View>
      )}

      {/* Medical Notes */}
      {caseData.medicalNotes && caseData.medicalNotes.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medical Notes ({caseData.medicalNotes.length})</Text>
          {caseData.medicalNotes.map((note, index) => (
            <View key={index} style={{
              backgroundColor: '#F9FAFB',
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
              borderLeftWidth: 3,
              borderLeftColor: '#3B82F6'
            }}>
              <Text style={[styles.rowSubtitle, {marginBottom: 4}]}>{note.note}</Text>
              <Text style={[styles.rowSubtitle, {fontSize: 10, color: '#9CA3AF'}]}>
                {formatDate(note.addedAt)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Timestamps */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <DetailRow label="Created At" value={formatDate(caseData.createdAt)} icon="📅" />
        {caseData.resolvedAt && (
          <DetailRow label="Resolved At" value={formatDate(caseData.resolvedAt)} icon="✅" />
        )}
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value, icon, multiline = false }) => (
  <View style={{marginBottom: 12}}>
    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
      {icon && <Text style={{fontSize: 16, marginRight: 6}}>{icon}</Text>}
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <Text style={[styles.rowSubtitle, {fontSize: 14, color: '#1F2937', marginLeft: icon ? 22 : 0}, multiline && {lineHeight: 20}]}>
      {value}
    </Text>
  </View>
);










