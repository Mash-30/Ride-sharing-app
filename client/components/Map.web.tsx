import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Colors } from '../constants/Colors';

const containerStyle = {
  width: '100%',
  height: 400,
};

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Region extends LocationCoords {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapProps {
  location: LocationCoords | null;
  initialRegion: Region;
}

// TODO: Replace with your Google Maps API key
// Get your API key from: https://console.cloud.google.com/
// Enable: Maps JavaScript API, Places API, Geocoding API
const GOOGLE_MAPS_API_KEY = 'AIzaSyAf4ysImzHExYfHRDAMpG5P9_CtCcIspOM';

export default function Map({ location, initialRegion }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Handle API key error
  if (loadError) {
    return (
      <View style={[styles.map, styles.webMapPlaceholder]}>
        <Text style={styles.webMapText}>
          Error loading Google Maps. Please check your API key.
        </Text>
        <Text style={styles.webMapSubtext}>
          Get your API key from Google Cloud Console
        </Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={[styles.map, styles.webMapPlaceholder]}>
        <Text style={styles.webMapText}>Loading map...</Text>
      </View>
    );
  }

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: initialRegion.latitude, lng: initialRegion.longitude };

  return (
    <View style={styles.map}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: false,
        }}
      >
        {location && (
          <Marker
            position={{ lat: location.latitude, lng: location.longitude }}
            title="Your Location"
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12),
            }}
          />
        )}
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 400,
    backgroundColor: '#e8f4fd',
  },
  webMapPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
  },
  webMapText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  webMapSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 