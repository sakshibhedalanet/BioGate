import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, THEME_COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const DATA = [
  {
    id: '1',
    title: 'SECURE\nACCESS',
    subtitle: 'v1.0_SHIELD',
    description: 'Advanced biometric security for your digital fortress. Deploying multi-factor protocols.',
    color: THEME_COLORS[0],
    icon: 'shield-lock',
  },
  {
    id: '2',
    title: 'BIO_SYNC\nGATEWAY',
    subtitle: 'v2.0_SYNC',
    description: 'Face and Fingerprint recognition at the speed of light. Syncing identity parameters.',
    color: THEME_COLORS[2],
    icon: 'fingerprint',
  },
  {
    id: '3',
    title: 'READY_TO\nINITIALIZE',
    subtitle: 'v3.0_START',
    description: 'Step into the future of authentication today. System initialization complete.',
    color: THEME_COLORS[5],
    icon: 'rocket-launch',
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentItem = DATA[currentIndex];

  const handleNext = () => {
    if (currentIndex < DATA.length - 1) {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex + 1);
        slideAnim.setValue(20);
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <Animated.View style={[
          styles.inner,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}>
          <View style={styles.header}>
            <View style={[styles.accentSquare, { backgroundColor: currentItem.color }]} />
            <Text style={styles.title}>{currentItem.title}</Text>
            <Text style={styles.subtitle}>{currentItem.subtitle}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.logoWrapper}>
               <MaterialCommunityIcons name={currentItem.icon as any} size={120} color={currentItem.color} />
            </View>
            <Text style={styles.description}>{currentItem.description}</Text>
          </View>
        </Animated.View>

        {/* Static Footer (indicators and button) */}
        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {DATA.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: i === currentIndex ? currentItem.color : '#222',
                    width: i === currentIndex ? 30 : 10
                  }
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: currentItem.color }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === DATA.length - 1 ? 'INITIALIZE' : 'NEXT_STEP'}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.decorationContainer}>
          <View style={[styles.decorCircle, { borderColor: currentItem.color, top: -50, right: -50 }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  inner: {
    zIndex: 10,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  accentSquare: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 5,
  },
  content: {
    marginTop: 20,
  },
  logoWrapper: {
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  description: {
    fontSize: 18,
    color: '#ccc',
    lineHeight: 28,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  nextButton: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 10,
    letterSpacing: 1,
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  decorCircle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    opacity: 0.1,
  },
});

export default OnboardingScreen;
