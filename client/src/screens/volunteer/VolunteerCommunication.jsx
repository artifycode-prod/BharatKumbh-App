import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { styles } from '../../styles/styles';

export const VolunteerCommunication = ({goHome}) => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Coordinator', text: 'All volunteers report to Sector 5', time: '10:30 AM' },
    { id: 2, from: 'Team', text: 'Water station setup complete', time: '11:15 AM' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      from: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput('');
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Header title="Communication" icon="💬" onBack={goHome} />
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Messages</Text>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.listRow, {marginBottom: 8}]}>
            <View style={[styles.round40, {backgroundColor: msg.from === 'You' ? '#10B981' : '#3B82F6'}]}>
              <Text style={styles.round40Text}>{msg.from === 'You' ? '👤' : '📢'}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowTitle}>{msg.from}</Text>
              <Text style={styles.rowSubtitle}>{msg.text}</Text>
              <Text style={[styles.rowSubtitle, {fontSize: 10, marginTop: 2}]}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.inputRow}>
          <View style={[styles.searchInput, {borderBottomWidth: 0, flex: 1}]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#9A3412"
              style={{height: 44, color: '#7C2D12'}}
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity onPress={sendMessage} style={[styles.round48, {backgroundColor: '#10B981'}]}>
            <Text style={styles.round48Text}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
