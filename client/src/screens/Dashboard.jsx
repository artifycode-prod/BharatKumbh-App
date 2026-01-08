import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Header } from '../components/Header';
import { styles } from '../styles/styles';

export const Dashboard = ({goHome}) => (
  <ScrollView contentContainerStyle={[styles.screenPad, {backgroundColor: '#1f1410'}]}>
    <Header title="Authority Dashboard" icon="🔱" onBack={goHome} />
    <View style={styles.grid}>
      <StatCard emoji="👥" value="2.5M" label="Active Pilgrims" color="#16A34A" />
      <StatCard emoji="🚨" value="12" label="Active SOS" color="#DC2626" />
      <StatCard emoji="🚑" value="8" label="Medical Requests" color="#2563EB" />
      <StatCard emoji="🔍" value="23" label="Lost Persons" color="#CA8A04" />
    </View>
    <View style={styles.cardTall}>
      <Text style={styles.sectionTitleAlt}>Real-time Crowd Heatmap</Text>
      <Image source={{uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=300&fit=crop'}} style={styles.heatImage} />
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitleAlt}>Active Emergency Alerts</Text>
      <AlertRow emoji="🚨" title="Medical Emergency" subtitle="Sector 7 • 2 min ago" color="#DC2626" btnLabel="Respond" />
      <AlertRow emoji="👮" title="Security Alert" subtitle="Ghat Area • 5 min ago" color="#EAB308" btnLabel="Assign" />
    </View>
  </ScrollView>
);

const StatCard = ({emoji, value, label, color}) => (
  <View style={[styles.statCard, {borderColor: '#EA580C'}]}>
    <View style={[styles.round48, {backgroundColor: color}]}>
      <Text style={styles.round48Text}>{emoji}</Text>
    </View>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AlertRow = ({emoji, title, subtitle, color, btnLabel}) => (
  <View style={[styles.actionRow, {borderColor: color}] }>
    <View style={[styles.round48, {backgroundColor: color}]}><Text style={styles.round48Text}>{emoji}</Text></View>
    <View style={{flex: 1}}>
      <Text style={styles.rowTitleAlt}>{title}</Text>
      <Text style={styles.rowSubtitleAlt}>{subtitle}</Text>
    </View>
    <View style={[styles.smallBtn, {backgroundColor: color}]}><Text style={styles.smallBtnText}>{btnLabel}</Text></View>
  </View>
);

