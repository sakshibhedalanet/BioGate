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
import { COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const DATA = [
  {
    id: '1',
    title: 'SECURE\nACCESS',
    description: 'Advanced biometric security for your digital fortress.',
    icon: 'shield-lock-outline',
    color: COLORS.palette[0],
  },
  {
    id: '2',
    title: 'BIOMETRIC\nGATEWAY',
    description: 'Face and Fingerprint recognition at the speed of light.',
    icon: 'fingerprint',
    color: COLORS.palette[2],
  },
  {
    id: '3',
    title: 'READY TO\nSTART?',
    description: 'Step into the future of authentication today.',
    icon: 'rocket-launch-outline',
    color: COLORS.palette[5],
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

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-10deg', '0deg', '10deg'],
    });

    return (
      <View style={styles.slide}>
        <View style={[styles.geometricBg, { backgroundColor: item.color, opacity: 0.1 }]} />
        <Animated.View style={[styles.iconContainer, { transform: [{ scale }, { rotate }] }]}>
          <View style={[styles.iconCircle, { borderColor: item.color }]}>
             <MaterialCommunityIcons name={item.icon as any} size={100} color={item.color} />
          </View>
          {/* Placeholder for SVG: In a real app, replace with <SvgUri source={...} /> */}
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
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

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {DATA.map((_, index) => {
            const widthAnim = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.indicator,
                  { width: widthAnim, opacity, backgroundColor: COLORS.palette[index % COLORS.palette.length] },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === DATA.length - 1 ? 'GET STARTED' : 'NEXT'}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
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
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  geometricBg: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: 100,
    top: -width * 0.5,
    right: -width * 0.5,
  },
  iconContainer: {
    marginBottom: 60,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: COLORS.textDim,
    lineHeight: 26,
    maxWidth: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
});

export default OnboardingScreen;
