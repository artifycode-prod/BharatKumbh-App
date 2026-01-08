import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';

const NavButton = ({id, label, icon, active, onChange}) => {
  const isActive = active === id;
  return (
    <TouchableOpacity onPress={() => onChange(id)} style={styles.navItem}>
      <View style={[styles.navIcon, isActive && {backgroundColor: '#EF4444'}]}>
        <Text style={[styles.navIconEmoji, isActive && {color: 'white'}]}>{icon}</Text>
      </View>
      <Text style={[styles.navLabel, isActive && {color: '#EF4444', fontWeight: '700'}]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const MedicalBottomNav = ({active, onChange}) => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarInner}>
        <NavButton id="dashboard" label="Home" icon="🏠" active={active} onChange={onChange} />
        <NavButton id="cases" label="Cases" icon="📋" active={active} onChange={onChange} />
        <NavButton id="camp" label="Camp" icon="🏥" active={active} onChange={onChange} />
        <NavButton id="inventory" label="Inventory" icon="💊" active={active} onChange={onChange} />
      </View>
    </View>
  );
};

