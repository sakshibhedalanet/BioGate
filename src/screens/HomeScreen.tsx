import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLogout = async () => {
    await authService.logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Success!</Text>
      <Text style={styles.message}>You are securely logged in.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
