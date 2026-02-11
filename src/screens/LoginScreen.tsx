import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';
import { useBiometrics } from '../hooks/useBiometrics';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { isCompatible, hasHardware, authenticate } = useBiometrics();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if already logged in
      const loggedIn = await authService.isLoggedIn();
      if (loggedIn) {
        navigation.replace('Home');
        return;
      }

      // Check biometric status and auto-trigger if enabled
      const enabled = await authService.isBiometricEnabled();
      setBiometricEnabled(enabled);

      if (enabled) {
        // Short delay to ensure UI is ready
        setTimeout(async () => {
          const success = await authenticate('Login to BioGate');
          if (success) {
            await authService.loginWithBiometrics();
            navigation.replace('Home');
          }
        }, 500);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async () => {
    const success = await authService.login(email, password);
    if (success) {
      const isBioEnabled = await authService.isBiometricEnabled();
      if (!isBioEnabled && isCompatible && hasHardware) {
        Alert.alert(
          'Enable Biometrics',
          'Would you like to enable biometric login for next time?',
          [
            {
              text: 'No',
              onPress: () => navigation.replace('Home'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                await authService.setBiometricEnabled(true);
                navigation.replace('Home');
              },
            },
          ]
        );
      } else {
        navigation.replace('Home');
      }
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Hint: user@example.com / password123');
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authenticate('Login to BioGate');
    if (success) {
      await authService.loginWithBiometrics();
      navigation.replace('Home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>BioGate</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {biometricEnabled && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
          >
            <Text style={styles.biometricButtonText}>Login with Biometrics</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    marginTop: 20,
    padding: 10,
  },
  biometricButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;
