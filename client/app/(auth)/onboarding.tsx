import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import CountryPicker from 'react-native-country-picker-modal';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Book Your Ride',
    description: 'Get a ride at your doorstep with just a few taps. Fast, reliable and convenient.',
    image: require('../../assets/images/onboarding/slide1.jpg'),
  },
  {
    id: 2,
    title: 'Track Your Journey',
    description: 'Real-time tracking and navigation to keep you informed about your ride status.',
    image: require('../../assets/images/onboarding/slide2.jpg'),
  },
  {
    id: 3,
    title: 'Safe & Comfortable',
    description: 'Professional drivers and quality service to ensure a comfortable journey.',
    image: require('../../assets/images/onboarding/slide3.jpg'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const slideRef = useRef<ScrollView>(null);
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleNext = () => {
    if (currentIndex < slides.length - 1 && slideRef.current) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      slideRef.current.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      router.replace('/(auth)/phone-verification');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/phone-verification');
  };

  const dotPosition = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(currentIndex * 20),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          scrollX.value = offsetX;
          setCurrentIndex(Math.round(offsetX / width));
        }}
        scrollEventThrottle={16}>
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        <View style={styles.paginationDots}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
          ))}
          <Animated.View style={[styles.dotIndicator, dotPosition]} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  dotIndicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    left: 6,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
}); 