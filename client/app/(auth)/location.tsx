import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../contexts/LocationContext';

const LocationScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { getCurrentLocation, isLoading } = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);

  const requestLocationPermission = async () => {
    try {
      setIsUpdating(true);
      const location = await getCurrentLocation();
      
      if (location) {
        // Update location in backend
        try {
          await apiService.updateLocation(location);
        } catch (error) {
          console.warn('Failed to update location in backend:', error);
        }

        router.replace('/(app)');
      } else {
        Alert.alert(
          'Location Permission Required',
          'Location permission is required to use the app. Please enable it in your device settings.',
          [
            { text: 'OK', style: 'default' }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.description}>
          We need your location to find nearby rides and provide accurate pickup services
        </Text>

        <TouchableOpacity 
          style={[styles.button, (isLoading || isUpdating) && styles.buttonDisabled]} 
          onPress={requestLocationPermission}
          disabled={isLoading || isUpdating}
        >
          {(isLoading || isUpdating) ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.buttonText}>Enable Location</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.privacyText}>
          Your location data will only be used while using the app and will never be shared without
          your permission
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default LocationScreen; 