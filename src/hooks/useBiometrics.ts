import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';

export const useBiometrics = () => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [hasHardware, setHasHardware] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);

      const enroll = await LocalAuthentication.isEnrolledAsync();
      setHasHardware(enroll);
    })();
  }, []);

  const authenticate = async (reason: string = 'Authenticate to continue') => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Enter Password',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  return {
    isCompatible,
    hasHardware,
    authenticate,
  };
};
