import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const AUTH_SESSION_KEY = 'biogate_session';
const BIOMETRIC_ENABLED_KEY = 'biogate_biometric_enabled';
const ONBOARDING_COMPLETE_KEY = 'biogate_onboarding_complete';

export const authService = {
  login: async (email: string, password: string): Promise<boolean> => {
    // Dummy validation
    if (email === 'user@gate.io' && password === 'gatekeeper') {
      await AsyncStorage.setItem(AUTH_SESSION_KEY, 'dummy-token');
      return true;
    }
    return false;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
  },

  isLoggedIn: async (): Promise<boolean> => {
    const session = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    return !!session;
  },

  setBiometricEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled.toString());
    } catch (e) {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled.toString());
    }
  },

  isBiometricEnabled: async (): Promise<boolean> => {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (e) {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    }
  },

  // For dummy purposes, we consider a successful biometric auth as a login
  loginWithBiometrics: async (): Promise<void> => {
    await AsyncStorage.setItem(AUTH_SESSION_KEY, 'dummy-token-biometric');
  },

  isOnboardingComplete: async (): Promise<boolean> => {
    const complete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return complete === 'true';
  },

  setOnboardingComplete: async (complete: boolean): Promise<void> => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, complete.toString());
  }
};
