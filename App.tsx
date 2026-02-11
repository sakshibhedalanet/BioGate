import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { authService } from './src/services/authService';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Login' | 'Home'>('Onboarding');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const onboardingComplete = await authService.isOnboardingComplete();
        const biometricEnabled = await authService.isBiometricEnabled();
        const loggedIn = await authService.isLoggedIn();

        if (!onboardingComplete) {
          setInitialRoute('Onboarding');
        } else if (biometricEnabled) {
          // If biometrics are enabled, always go to Login to challenge the user
          setInitialRoute('Login');
        } else if (loggedIn) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Failed to check app status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator initialRouteName={initialRoute} />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
