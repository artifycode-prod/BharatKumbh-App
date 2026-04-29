import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const TEAM = [
  {
    name: 'Rushikesh Solanke',
    role: 'MERN Developer',
    image: require('../assets/RushikeshSolanke.jpeg'),
    linkedin: 'https://www.linkedin.com/in/rushikesh-solanke-86ab9b325',
  },
  {
    name: 'Harshada Vibhandik',
    role: 'Android Developer',
    image: require('../assets/HarshadaVibhandik.jpeg'),
    linkedin: 'https://www.linkedin.com/in/harshada-vibhandik-7b1466257/',
  },
  {
    name: 'Richa Rajole',
    role: 'Backend Developer',
    image: require('../assets/RichaRajole.jpeg'),
    linkedin: 'https://www.linkedin.com/in/richa-rajole-0766ab289',
  },
  {
    name: 'Onkar Wakchaure',
    role: 'UI/UX Designer',
    image: require('../assets/OnkarWakchaure.jpeg'),
    linkedin: 'https://www.linkedin.com/in/onkar-wakchaure-a04703372?trk',
  },
];

const AboutUs = () => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.appName}>BharatKumbh</Text>
    <Text style={styles.title}>About Us</Text>
    <Text style={styles.text}>
      Welcome to BharatKumbh! This app is designed to help pilgrims, volunteers, and all visitors during the Maha Kumbh Nashik 2027. Here you can find information, navigation, emergency help, and more. Our mission is to make your Kumbh experience safe, informed, and memorable.
    </Text>
    <Text style={styles.sectionTitle}>Our Team</Text>
    <View style={styles.teamContainer}>
      {Array.from({ length: Math.ceil(TEAM.length / 2) }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.teamRow}>
          {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).map((member) => (
            <View key={member.name} style={styles.memberCard}>
              <Image source={member.image} style={styles.memberPhoto} />
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(member.linkedin)}>
                <Icon name="linkedin-square" size={28} color="#2563EB" style={styles.linkIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
    <Text style={styles.text}>
      For any queries or support, please contact our helpdesk or visit the official Kumbh website.
    </Text>
  </ScrollView>
);


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#7C2D12',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: '#7C2D12',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  teamContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  memberCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    alignItems: 'center',
    padding: 12,
    margin: 8,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  memberPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C2D12',
    marginBottom: 2,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 13,
    color: '#9A3412',
    marginBottom: 4,
    textAlign: 'center',
  },
  linkIcon: {
    marginTop: 2,
    marginBottom: 2,
  },
});

export { AboutUs };
