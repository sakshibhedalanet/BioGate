import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';
import { COLORS, THEME_COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../components/Logo';

const { width, height } = Dimensions.get('window');

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
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await authService.setOnboardingComplete(true);
      navigation.replace('Login');
    }
  };

  const renderItem = ({ item, index }: { item: typeof DATA[0]; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    });

    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.inner, { opacity }]}>
          <View style={styles.header}>
            <View style={[styles.accentSquare, { backgroundColor: item.color }]} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.logoWrapper}>
               <Logo size={120} color={item.color} />
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.indicatorContainer}>
              {DATA.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: i === index ? item.color : '#222',
                      width: i === index ? 30 : 10
                    }
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: item.color }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {index === DATA.length - 1 ? 'INITIALIZE' : 'NEXT_STEP'}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.decorationContainer}>
          <View style={[styles.decorCircle, { borderColor: item.color, top: -50, right: -50 }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    height,
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
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
