import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    opacity.value = withTiming(1, { duration: 1000 });

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('../../assets/images/splash-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
}); 