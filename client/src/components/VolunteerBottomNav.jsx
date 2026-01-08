import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';

const NavButton = ({id, label, short, active, onChange}) => {
  const isActive = active === id;
  return (
    <TouchableOpacity onPress={() => onChange(id)} style={styles.navItem}>
      <View style={[styles.navIcon, isActive && {backgroundColor: '#10B981'}]}>
        <Text
          style={[
            styles.navIconEmoji,
            {fontWeight: '700'},
            isActive && {color: 'white'},
          ]}>
          {short}
        </Text>
      </View>
      <Text
        style={[
          styles.navLabel,
          isActive && {color: '#10B981', fontWeight: '700'},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const VolunteerBottomNav = ({active, onChange}) => {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarInner}>
        <NavButton id="dashboard" label="Home" short="H" active={active} onChange={onChange} />
        <NavButton id="tasks" label="Tasks" short="T" active={active} onChange={onChange} />
        <NavButton id="lostfound" label="Lost" short="L" active={active} onChange={onChange} />
        <NavButton id="sos" label="SOS" short="S" active={active} onChange={onChange} />
        <NavButton id="communication" label="Chat" short="C" active={active} onChange={onChange} />
      </View>
    </View>
  );
};

