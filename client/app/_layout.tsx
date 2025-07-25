import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { AuthProvider } from '../contexts/AuthContext';
import { RideProvider } from '../contexts/RideContext';
import { LocationProvider } from '../contexts/LocationContext';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('Error preventing splash screen from auto hiding:', e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn('Error hiding splash screen:', e);
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RideProvider>
          <LocationProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
          </LocationProvider>
        </RideProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
