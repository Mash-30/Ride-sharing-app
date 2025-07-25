import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useRide } from '../../contexts/RideContext';
import { Ride } from '../../services/api';

export default function RidesScreen() {
  const { rideHistory, getRides, isLoading } = useRide();
  const [activeTab, setActiveTab] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRides();
  }, [activeTab]);

  const loadRides = async () => {
    try {
      if (activeTab === 'active') {
        await getRides('active');
      } else {
        await getRides('completed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load rides');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRides();
    setRefreshing(false);
  };

  const renderRideCard = ({ item }: { item: Ride }) => {
    const isActive = item.status === 'active' || item.status === 'pending';

    return (
      <View style={styles.rideCard}>
        <View style={styles.rideHeader}>
          <View style={styles.driverInfo}>
            <FontAwesome5 name="user-circle" size={40} color={Colors.textPrimary} />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>
                {item.driverId ? 'Driver Assigned' : 'Searching for Driver'}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesome5 name="star" size={12} color={Colors.primary} />
                <Text style={styles.rating}>4.8</Text>
              </View>
            </View>
          </View>
          <Text style={styles.price}>${item.fare.toFixed(2)}</Text>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.locationContainer}>
            <FontAwesome5 name="circle" size={12} color={Colors.primary} solid />
            <Text style={styles.location}>{item.pickupAddress}</Text>
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={16} color={Colors.primary} />
            <Text style={styles.location}>{item.dropoffAddress}</Text>
          </View>
        </View>

        <View style={styles.rideFooter}>
          <View style={styles.carInfo}>
            <FontAwesome5 name="car" size={14} color={Colors.textSecondary} />
            <Text style={styles.carText}>
              {item.driverId ? 'Toyota Camry • ABC 123' : 'Finding nearby driver'}
            </Text>
          </View>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {isActive && (
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const filteredRides = rideHistory.filter(
    (ride) => (activeTab === 'active' && (ride.status === 'active' || ride.status === 'pending')) ||
    (activeTab === 'history' && ride.status === 'completed')
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading rides...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRides}
        renderItem={renderRideCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ridesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="car" size={50} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              {activeTab === 'active' ? 'No active rides' : 'No ride history'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  ridesList: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverDetails: {
    marginLeft: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rideDetails: {
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  location: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  locationDivider: {
    width: 2,
    height: 20,
    backgroundColor: Colors.divider,
    marginLeft: 5,
    marginVertical: 5,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  time: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  trackButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  trackButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textSecondary,
  },
}); 