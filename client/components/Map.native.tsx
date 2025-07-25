import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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

// IMPORTANT:
// 1. For iOS: Add your Google Maps API key to AppDelegate.m
//    [GMSServices provideAPIKey:@"YOUR_IOS_GOOGLE_MAPS_API_KEY"];
// 2. For Android: Add your API key to android/app/src/main/AndroidManifest.xml
//    <meta-data android:name="com.google.android.geo.API_KEY" android:value="YOUR_ANDROID_GOOGLE_MAPS_API_KEY"/>

export default function Map({ location, initialRegion }: MapProps) {
  const region = location
    ? {
        ...location,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      }
    : initialRegion;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && (
          <Marker coordinate={location} />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
}); 