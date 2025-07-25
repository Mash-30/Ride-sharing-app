import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: LocationCoords | null;
  setLocation: (location: LocationCoords | null) => void;
  getCurrentLocation: () => Promise<LocationCoords | null>;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission denied');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(newLocation);
      return newLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    location,
    setLocation,
    getCurrentLocation,
    isLoading,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 