import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';

export const MedicalInventory = ({goHome}) => {
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Bandages', quantity: 150, unit: 'pieces' },
    { id: 2, item: 'Antiseptic', quantity: 50, unit: 'bottles' },
    { id: 3, item: 'Pain Relievers', quantity: 200, unit: 'tablets' },
    { id: 4, item: 'First Aid Kits', quantity: 25, unit: 'kits' },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Medical Inventory" icon="💊" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inventory Items</Text>
        {inventory.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <View style={[styles.round48, {backgroundColor: '#EF4444'}]}>
              <Text style={styles.round48Text}>💊</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{item.item}</Text>
              <Text style={styles.rowSubtitle}>
                Quantity: {item.quantity} {item.unit}
              </Text>
            </View>
            <View style={[styles.round32, item.quantity < 30 ? {backgroundColor: '#DC2626'} : {backgroundColor: '#16A34A'}]}>
              <Text style={styles.round32Text}>{item.quantity < 30 ? '⚠️' : '✓'}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
