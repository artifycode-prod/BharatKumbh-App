import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';

const NavButton = ({id, label, icon, active, onChange}) => {
  const isActive = active === id;
  return (
    <TouchableOpacity onPress={() => onChange(id)} style={styles.navItem}>
      <View style={[styles.navIcon, isActive && {backgroundColor: '#3B82F6'}]}>
        <Text style={[styles.navIconEmoji, isActive && {color: 'white'}]}>{icon}</Text>
      </View>
      <Text style={[styles.navLabel, isActive && {color: '#3B82F6', fontWeight: '700'}]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const AdminBottomNav = ({active, onChange}) => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarInner}>
        <NavButton id="dashboard" label="Home" icon="🏠" active={active} onChange={onChange} />
        <NavButton id="volunteers" label="Volunteers" icon="🤝" active={active} onChange={onChange} />
        <NavButton id="registrations" label="Registrations" icon="📱" active={active} onChange={onChange} />
        <NavButton id="emergency" label="Emergency" icon="🚨" active={active} onChange={onChange} />
      </View>
    </View>
  );
};

