import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import Map from '../../components/Map';
import { LocationCoords, Region } from '../../components/Map/types';
import { useRide } from '../../contexts/RideContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../contexts/LocationContext';
import apiService from '../../services/api';

const INITIAL_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { estimateFare, bookRide, isLoading } = useRide();
  const { location, getCurrentLocation, isLoading: isLocationLoading } = useLocation();
  const [destination, setDestination] = useState('');
  const [showRideOptions, setShowRideOptions] = useState(false);
  const [fareEstimate, setFareEstimate] = useState<{
    estimatedFare: number;
    distance: string;
    duration: string;
  } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    // If location is not available, try to get it
    if (!location) {
      getCurrentLocation();
    }
  }, [location, getCurrentLocation]);

  const handleRefreshLocation = async () => {
    try {
      const newLocation = await getCurrentLocation();
      if (newLocation) {
        // Update location in backend
        try {
          await apiService.updateLocation(newLocation);
        } catch (error) {
          console.warn('Failed to update location in backend:', error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh location. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    try {
      setIsEstimating(true);
      // For demo purposes, we'll use a mock destination location
      // In a real app, you would use a geocoding service to convert address to coordinates
      const mockDestination: LocationCoords = {
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.01,
      };

      const estimate = await estimateFare(location, mockDestination);
      setFareEstimate(estimate);
      setShowRideOptions(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to estimate fare. Please try again.');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleBookRide = async (rideType: string) => {
    if (!location || !fareEstimate) {
      Alert.alert('Error', 'Location or fare estimate not available');
      return;
    }

    try {
      const mockDestination: LocationCoords = {
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.01,
      };

      const pickupAddress = 'Current Location';
      const dropoffAddress = destination || 'Destination';

      await bookRide(location, mockDestination, pickupAddress, dropoffAddress, fareEstimate.estimatedFare);
      
      Alert.alert('Success', 'Ride booked successfully!');
      setShowRideOptions(false);
      setDestination('');
      setFareEstimate(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to book ride. Please try again.');
    }
  };

  const rideOptions = [
    {
      id: 'economy',
      name: 'Economy',
      price: fareEstimate ? `$${fareEstimate.estimatedFare.toFixed(2)}` : '$10-15',
      time: fareEstimate ? fareEstimate.duration : '5 min',
      icon: 'car',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: fareEstimate ? `$${(fareEstimate.estimatedFare * 1.5).toFixed(2)}` : '$20-25',
      time: fareEstimate ? fareEstimate.duration : '3 min',
      icon: 'car-side',
    },
    {
      id: 'luxury',
      name: 'Luxury',
      price: fareEstimate ? `$${(fareEstimate.estimatedFare * 2).toFixed(2)}` : '$30-35',
      time: fareEstimate ? fareEstimate.duration : '7 min',
      icon: 'car-alt',
    },
  ];

  return (
    <View style={styles.container}>
      <Map location={location} initialRegion={INITIAL_REGION} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome5 name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
            onSubmitEditing={handleSearch}
            editable={!isEstimating}
          />
          {isEstimating && (
            <ActivityIndicator size="small" color={Colors.primary} />
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefreshLocation}
          disabled={isLocationLoading}
        >
          <FontAwesome5 
            name="location-arrow" 
            size={16} 
            color={isLocationLoading ? Colors.textSecondary : Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {showRideOptions && (
        <View style={styles.rideOptionsContainer}>
          <Text style={styles.rideOptionsTitle}>Choose your ride</Text>
          {fareEstimate && (
            <View style={styles.fareInfo}>
              <Text style={styles.fareInfoText}>
                Distance: {fareEstimate.distance} • Time: {fareEstimate.duration}
              </Text>
            </View>
          )}
          {rideOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.rideOption}
              onPress={() => handleBookRide(option.id)}
              disabled={isLoading}
            >
              <FontAwesome5 name={option.icon} size={24} color={Colors.textPrimary} />
              <View style={styles.rideOptionInfo}>
                <Text style={styles.rideOptionName}>{option.name}</Text>
                <Text style={styles.rideOptionTime}>{option.time} away</Text>
              </View>
              <Text style={styles.rideOptionPrice}>{option.price}</Text>
            </TouchableOpacity>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.loadingText}>Booking your ride...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  rideOptionsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  fareInfo: {
    backgroundColor: Colors.divider,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  fareInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  rideOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rideOptionInfo: {
    flex: 1,
    marginLeft: 15,
  },
  rideOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rideOptionTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rideOptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  refreshButton: {
    position: 'absolute',
    right: 35,
    top: 15,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
}); 
 