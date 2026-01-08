import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';

export const MedicalCamp = ({goHome}) => {
  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Medical Camp" icon="🏥" onBack={goHome} />
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Camp Information</Text>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Location:</Text>
          <Text style={styles.kvValueDark}>Panchavati Medical Camp</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Status:</Text>
          <Text style={styles.kvValueDark}>Operational</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Hours:</Text>
          <Text style={styles.kvValueDark}>24x7</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvLabelDark}>Contact:</Text>
          <Text style={styles.kvValueDark}>108</Text>
        </View>
      </View>
    </ScrollView>
  );
};
