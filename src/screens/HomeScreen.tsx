import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';
import { COLORS, THEME_COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLogout = async () => {
    await authService.logout();
    navigation.replace('Login');
  };

  const Card = ({ title, icon, color, value }: any) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.welcome}>COMMAND_CENTER</Text>
            <Text style={styles.status}>SYSTEM_STATUS: <Text style={{ color: '#00FF00' }}>ONLINE</Text></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="power" size={24} color={THEME_COLORS[1]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          <Card title="SECURITY_LVL" icon="shield-check" color={THEME_COLORS[0]} value="MAXIMUM" />
          <Card title="SESSION_TIME" icon="clock-outline" color={THEME_COLORS[2]} value="00:12:45" />
          <Card title="ACTIVE_GATES" icon="door-open" color={THEME_COLORS[4]} value="12" />
          <Card title="THREAT_LEVEL" icon="alert-decagram" color={THEME_COLORS[6]} value="NULL" />
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>INITIATE_SYSTEM_SCAN</Text>
          <MaterialCommunityIcons name="radar" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BIOGATE SECURE TERMINAL v2.0.4</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  welcome: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  status: {
    fontSize: 12,
    color: COLORS.textDim,
    fontWeight: '700',
    marginTop: 4,
  },
  logoutBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  content: {
    padding: 25,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#14141A',
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 10,
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  actionButton: {
    height: 70,
    backgroundColor: THEME_COLORS[0],
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 15,
    letterSpacing: 1,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default HomeScreen;
