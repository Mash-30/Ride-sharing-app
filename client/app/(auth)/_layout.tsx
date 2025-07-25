import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="phone-verification" />
      <Stack.Screen name="location" />
    </Stack>
  );
} 