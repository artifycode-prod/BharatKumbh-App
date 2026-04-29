import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';

export function CustomDrawerContent(props) {
  return (
    <LinearGradient
      colors={['#FF9933', '#FFB74D', '#FFF7ED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandEmoji}>🪷</Text>
        </View>
        <Text style={styles.brandName}>BharatKumbh</Text>
        <Text style={styles.brandTagline}>Maha Kumbh Nashik 2027</Text>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Safe • Informed • Memorable</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  brandBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandEmoji: {
    fontSize: 28,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C2D12',
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 12,
    color: '#9A3412',
    marginTop: 4,
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  footerText: {
    fontSize: 11,
    color: '#9A3412',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
