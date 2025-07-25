import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ride, LocationCoords, FareEstimate } from '../services/api';
import apiService from '../services/api';

interface RideContextType {
  currentRide: Ride | null;
  rideHistory: Ride[];
  isLoading: boolean;
  estimateFare: (pickup: LocationCoords, dropoff: LocationCoords) => Promise<FareEstimate>;
  bookRide: (
    pickup: LocationCoords,
    dropoff: LocationCoords,
    pickupAddress: string,
    dropoffAddress: string,
    fare: number
  ) => Promise<Ride>;
  getRides: (status?: Ride['status']) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  updateCurrentRide: (ride: Ride | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const estimateFare = async (pickup: LocationCoords, dropoff: LocationCoords): Promise<FareEstimate> => {
    try {
      return await apiService.estimateFare(pickup, dropoff);
    } catch (error) {
      console.error('Error estimating fare:', error);
      throw error;
    }
  };

  const bookRide = async (
    pickup: LocationCoords,
    dropoff: LocationCoords,
    pickupAddress: string,
    dropoffAddress: string,
    fare: number
  ): Promise<Ride> => {
    try {
      setIsLoading(true);
      const newRide = await apiService.bookRide(pickup, dropoff, pickupAddress, dropoffAddress, fare);
      setCurrentRide(newRide);
      return newRide;
    } catch (error) {
      console.error('Error booking ride:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRides = async (status?: Ride['status']) => {
    try {
      setIsLoading(true);
      const rides = await apiService.getRides(status);
      if (status === 'active' || status === 'pending') {
        setCurrentRide(rides.find(ride => ride.status === 'active' || ride.status === 'pending') || null);
      } else {
        setRideHistory(rides);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRide = async (rideId: string) => {
    try {
      await apiService.cancelRide(rideId);
      setCurrentRide(null);
      await getRides();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      throw error;
    }
  };

  const updateCurrentRide = (ride: Ride | null) => {
    setCurrentRide(ride);
  };

  const value: RideContextType = {
    currentRide,
    rideHistory,
    isLoading,
    estimateFare,
    bookRide,
    getRides,
    cancelRide,
    updateCurrentRide,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}; 