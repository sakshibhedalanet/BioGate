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
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';
import { useBiometrics } from '../hooks/useBiometrics';
import { COLORS, THEME_COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { isCompatible, hasHardware, authenticate } = useBiometrics();

  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const initializeAuth = async () => {
      // If already logged in AND biometrics are NOT enabled, just go home
      const loggedIn = await authService.isLoggedIn();
      const enabled = await authService.isBiometricEnabled();
      setBiometricEnabled(enabled);

      if (loggedIn && !enabled) {
        navigation.replace('Home');
        return;
      }

      // If biometrics are enabled, trigger them automatically
      if (enabled) {
        handleBiometricLogin();
      }
    };

    initializeAuth();
  }, []);

  const startScanningAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
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
          'ENABLE BIOMETRICS',
          'SECURE YOUR ACCESS WITH BIOMETRIC DATA.',
          [
            { text: 'SKIP', onPress: () => navigation.replace('Home'), style: 'cancel' },
            {
              text: 'ENABLE',
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
      Alert.alert('ACCESS DENIED', 'INVALID CREDENTIALS.');
    }
  };

  const handleBiometricLogin = async () => {
    startScanningAnimation();
    const success = await authenticate('BIOMETRIC VERIFICATION');
    if (success) {
      // Even if session expired, biometric success can log in if we stored credentials,
      // but for this demo, we assume biometric success = access granted.
      await authService.loginWithBiometrics();
      navigation.replace('Home');
    }
    stopScanningAnimation();
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={[styles.accentSquare, { backgroundColor: THEME_COLORS[0] }]} />
          <Text style={styles.title}>BIOGATE</Text>
          <Text style={styles.subtitle}>SYSTEM_AUTH_v2.0</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>IDENT_EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="user@gate.io"
              placeholderTextColor="#444"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>SECURE_TOKEN</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#444"
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>INITIATE_ACCESS</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {biometricEnabled && (
          <TouchableOpacity
            style={styles.biometricSection}
            onPress={handleBiometricLogin}
          >
            <View style={styles.scannerContainer}>
               <Animated.View style={[styles.scanLine, { transform: [{ translateY }], backgroundColor: THEME_COLORS[2] }]} />
               <MaterialCommunityIcons name="face-recognition" size={80} color={THEME_COLORS[2]} style={{ opacity: 0.2 }} />
            </View>
            <Text style={[styles.biometricText, { color: THEME_COLORS[2] }]}>WAITING_FOR_BIO_SYNC...</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.decorationContainer}>
        <View style={[styles.decorCircle, { borderColor: THEME_COLORS[4], top: -50, right: -50 }]} />
        <View style={[styles.decorCircle, { borderColor: THEME_COLORS[6], bottom: -100, left: -100, width: 300, height: 300 }]} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 30,
    justifyContent: 'center',
  },
  inner: {
    zIndex: 10,
  },
  header: {
    marginBottom: 50,
  },
  accentSquare: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    fontWeight: '700',
    letterSpacing: 2,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 25,
  },
  label: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderColor: '#222',
    backgroundColor: '#111',
    borderRadius: 0,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  biometricSection: {
    marginTop: 50,
    alignItems: 'center',
  },
  scannerContainer: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#161616',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 3,
    zIndex: 5,
  },
  biometricText: {
    marginTop: 15,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 150,
    borderWidth: 1,
    opacity: 0.1,
  },
});

export default LoginScreen;
