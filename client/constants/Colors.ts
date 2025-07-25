/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#FFC107',
  primaryDark: '#FFA000',
  primaryLight: '#FFE082',
  secondary: '#212121',
  accent: '#757575',
  textPrimary: '#212121',
  textSecondary: '#757575',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  divider: '#BDBDBD',
  disabled: '#9E9E9E',
  placeholder: '#9E9E9E',

  // Light theme
  light: {
    primary: '#FFC107',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#212121',
    border: '#BDBDBD',
    notification: '#FF9800',
    mapStyle: 'standard',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },

  // Dark theme
  dark: {
    primary: '#FFA000',
    background: '#121212',
    surface: '#1E1E1E',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
    notification: '#FF9800',
    mapStyle: 'dark',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
