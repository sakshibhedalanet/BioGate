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
        // ALWAYS start with Onboarding as per user request
        setInitialRoute('Onboarding');
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
