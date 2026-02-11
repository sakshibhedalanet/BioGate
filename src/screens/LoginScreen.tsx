import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Easing,
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

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializeAuth = async () => {
      const loggedIn = await authService.isLoggedIn();
      if (loggedIn) {
        navigation.replace('Home');
        return;
      }

      const enabled = await authService.isBiometricEnabled();
      setBiometricEnabled(enabled);

      if (enabled) {
        startScanningAnimation();
        setTimeout(async () => {
          const success = await authenticate('Login to BioGate');
          if (success) {
            await authService.loginWithBiometrics();
            navigation.replace('Home');
          }
          stopScanningAnimation();
        }, 500);
      }
    };

    initializeAuth();
  }, []);

  const startScanningAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopScanningAnimation = () => {
    scanAnim.stopAnimation();
    scanAnim.setValue(0);
  };

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
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  const handleBiometricLogin = async () => {
    startScanningAnimation();
    const success = await authenticate('Login to BioGate');
    if (success) {
      await authService.loginWithBiometrics();
      navigation.replace('Home');
    }
    stopScanningAnimation();
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image source={require('../../assets/profile.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>BioGate</Text>
        <Text style={styles.subtitle}>Secure Entry System</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Identity Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Security Pin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ACCESS SYSTEM</Text>
        </TouchableOpacity>

        {biometricEnabled && (
          <TouchableOpacity
            style={styles.biometricArea}
            onPress={handleBiometricLogin}
          >
            <View style={styles.scannerFrame}>
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
              <Text style={styles.scannerIcon}>👤</Text>
            </View>
            <Text style={styles.biometricText}>Waiting for Biometric...</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark theme for high-tech look
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#007AFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#252525',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  biometricArea: {
    marginTop: 30,
    alignItems: 'center',
  },
  scannerFrame: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#007AFF',
    zIndex: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  scannerIcon: {
    fontSize: 60,
    opacity: 0.3,
  },
  biometricText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LoginScreen;
