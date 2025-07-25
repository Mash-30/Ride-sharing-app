import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use localhost for development - this works for both web and mobile when using Expo
const API_BASE_URL = __DEV__ ? 'http://localhost:5000/api/v1' : 'https://your-production-api.com/api/v1';

// For mobile development, you might need to use your computer's IP address
// const API_BASE_URL = __DEV__ ? 'http://192.168.0.101:5000/api/v1' : 'https://your-production-api.com/api/v1';

// Web-compatible storage functions
const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.warn('Error getting storage item:', error);
    return null;
  }
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.warn('Error setting storage item:', error);
  }
};

const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.warn('Error removing storage item:', error);
  }
};

// Types for API responses
export interface User {
  _id: string;
  phoneNumber: string;
  isVerified: boolean;
  profile?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export interface Ride {
  _id: string;
  userId: string;
  pickupLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  dropoffLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  pickupAddress: string;
  dropoffAddress: string;
  fare: number;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled';
  driverId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  _id: string;
  userId: string;
  stripePaymentMethodId: string;
  cardBrand: string;
  last4: string;
  isDefault?: boolean;
}

export interface Transaction {
  _id: string;
  userId: string;
  rideId?: string;
  amount: number;
  type: 'ride' | 'credit' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface FareEstimate {
  estimatedFare: number;
  distance: string;
  duration: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ride_update' | 'payment' | 'promo' | 'system';
  isRead: boolean;
  createdAt: string;
}

// API Service Class
class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await getStorageItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await setStorageItem('auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async removeToken() {
    try {
      await removeStorageItem('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`🌐 Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        console.error(`❌ API Error (${response.status}):`, errorMessage);
        console.error(`🔗 Failed URL: ${url}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API request successful: ${endpoint}`);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error(`🔗 Failed URL: ${url}`);
      console.error(`📋 Request config:`, config);
      throw error;
    }
  }

  // Auth Service Methods
  async sendOtp(phoneNumber: string): Promise<any> {
    return this.makeRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<{ message: string; token: string }> {
    const response = await this.makeRequest<{ message: string; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
    
    await this.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  // User Service Methods
  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/users/me');
  }

  async updateProfile(profile: Partial<User['profile']>): Promise<User> {
    return this.makeRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile }),
    });
  }

  // Ride Service Methods
  async estimateFare(pickup: LocationCoords, dropoff: LocationCoords): Promise<FareEstimate> {
    return this.makeRequest<FareEstimate>('/rides/estimate-fare', {
      method: 'POST',
      body: JSON.stringify({
        pickup: {
          coordinates: [pickup.longitude, pickup.latitude],
        },
        dropoff: {
          coordinates: [dropoff.longitude, dropoff.latitude],
        },
      }),
    });
  }

  async bookRide(
    pickup: LocationCoords,
    dropoff: LocationCoords,
    pickupAddress: string,
    dropoffAddress: string,
    fare: number
  ): Promise<Ride> {
    return this.makeRequest<Ride>('/rides/book', {
      method: 'POST',
      body: JSON.stringify({
        pickup: {
          coordinates: [pickup.longitude, pickup.latitude],
        },
        dropoff: {
          coordinates: [dropoff.longitude, dropoff.latitude],
        },
        pickupAddress,
        dropoffAddress,
        fare,
      }),
    });
  }

  async getRides(status?: Ride['status']): Promise<Ride[]> {
    const params = status ? `?status=${status}` : '';
    return this.makeRequest<Ride[]>(`/rides${params}`);
  }

  async getRideById(rideId: string): Promise<Ride> {
    return this.makeRequest<Ride>(`/rides/${rideId}`);
  }

  async cancelRide(rideId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/rides/${rideId}/cancel`, {
      method: 'PUT',
    });
  }

  // Payment Service Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.makeRequest<PaymentMethod[]>('/payments/methods');
  }

  async addPaymentMethod(paymentToken: string): Promise<PaymentMethod> {
    return this.makeRequest<PaymentMethod>('/payments/methods', {
      method: 'POST',
      body: JSON.stringify({ paymentToken }),
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.makeRequest<Transaction[]>('/payments/transactions');
  }

  // Location Service Methods
  async updateLocation(location: LocationCoords): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/locations/update', {
      method: 'POST',
      body: JSON.stringify({
        coordinates: [location.longitude, location.latitude],
      }),
    });
  }

  async getNearbyDrivers(location: LocationCoords): Promise<any[]> {
    return this.makeRequest<any[]>(`/locations/nearby-drivers?lat=${location.latitude}&lng=${location.longitude}`);
  }

  // Notification Service Methods
  async getNotifications(): Promise<Notification[]> {
    return this.makeRequest<Notification[]>('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Analytics Service Methods
  async trackEvent(event: string, data?: any): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/track/event', {
      method: 'POST',
      body: JSON.stringify({ event, data }),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 