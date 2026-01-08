import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';

const NavButton = ({id, label, icon, active, onChange}) => {
  const isActive = active === id;
  return (
    <TouchableOpacity onPress={() => onChange(id)} style={styles.navItem}>
      <View style={[styles.navIcon, isActive && styles.navIconActive]}>
        <Text
          style={[
            styles.navIconEmoji,
            isActive && styles.navIconEmojiActive,
          ]}>
          {icon}
        </Text>
      </View>
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const BottomNav = ({active, onChange}) => {
  const isSosActive = active === 'sos';

  return (
    <View style={styles.bottomBar}>
      <View style={[styles.bottomBarInner, {alignItems: 'center'}]}>
        {/* Left items */}
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
          <NavButton
            id="home"
            label="Home"
            icon="🏠"
            active={active}
            onChange={onChange}
          />
          <NavButton
            id="navigation"
            label="Navigate"
            icon="🧭"
            active={active}
            onChange={onChange}
          />
        </View>

        {/* Center SOS - smaller and elegant */}
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => onChange('sos')}
            activeOpacity={0.9}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isSosActive ? '#B91C1C' : '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#FDE68A',
            }}>
            <Text style={{fontSize: 20}}>🚨</Text>
          </TouchableOpacity>
        </View>

        {/* Right items */}
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          <NavButton
            id="medical"
            label="Medical"
            icon="🚑"
            active={active}
            onChange={onChange}
          />
          <NavButton
            id="chatbot"
            label="Assistant"
            icon="🪷"
            active={active}
            onChange={onChange}
          />
        </View>
      </View>
    </View>
  );
};

