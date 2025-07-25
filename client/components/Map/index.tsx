import React from 'react';
import { Platform, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MapProps } from './types';

const { width, height } = Dimensions.get('window');

// Only import MapView on native platforms
let MapView: any;
let Marker: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function Map({ location, initialRegion }: MapProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.map, styles.webMapPlaceholder]}>
        <Text style={styles.webMapText}>
          Map view is not available on web platform
        </Text>
      </View>
    );
  }

  return (
    <MapView
      provider="google"
      style={styles.map}
      initialRegion={initialRegion}
      region={
        location
          ? {
              ...location,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          : initialRegion
      }>
      {location && (
        <Marker
          coordinate={location}
          title="Your Location"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
  webMapPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMapText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
}); 