# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Ride Sharing App - Backend Integration

This document describes the complete integration between the React Native client and the microservices backend for the ride sharing application.

## Architecture Overview

The application follows a microservices architecture with the following components:

### Backend Services
- **API Gateway** (Port 5000): Routes requests to appropriate microservices
- **User Service** (Port 5001): Handles authentication and user management
- **Ride Service** (Port 5002): Manages ride booking and tracking
- **Location Service** (Port 5003): Handles location updates and nearby driver search
- **Payment Service** (Port 5004): Manages payment methods and transactions
- **Notification Service** (Port 5005): Handles push notifications
- **Analytics Service** (Port 5006): Tracks user behavior and app analytics
- **Admin Service** (Port 5007): Admin dashboard and management

### Client App
- **React Native** with Expo Router
- **TypeScript** for type safety
- **Context API** for state management
- **Secure Store** for token management

## Integration Points

### 1. Authentication Flow

**Files Modified:**
- `app/(auth)/phone-verification.tsx`
- `contexts/AuthContext.tsx`
- `services/api.ts`

**Flow:**
1. User enters phone number
2. Client calls `POST /api/v1/auth/send-otp` (User Service)
3. User enters OTP
4. Client calls `POST /api/v1/auth/verify-otp` (User Service)
5. JWT token is stored in SecureStore
6. User is redirected to location permission screen

### 2. Location Services

**Files Modified:**
- `app/(auth)/location.tsx`
- `services/api.ts`

**Flow:**
1. User grants location permission
2. Current location is obtained via Expo Location
3. Client calls `POST /api/v1/locations/update` (Location Service)
4. User is redirected to main app

### 3. Ride Booking

**Files Modified:**
- `app/(app)/home.tsx`
- `contexts/RideContext.tsx`
- `services/api.ts`

**Flow:**
1. User enters destination
2. Client calls `POST /api/v1/rides/estimate-fare` (Ride Service)
3. Fare estimate is displayed with ride options
4. User selects ride type
5. Client calls `POST /api/v1/rides/book` (Ride Service)
6. Ride is created and assigned to driver

### 4. Ride Management

**Files Modified:**
- `app/(app)/rides.tsx`
- `contexts/RideContext.tsx`
- `services/api.ts`

**Flow:**
1. App loads ride history
2. Client calls `GET /api/v1/rides?status=active` (Ride Service)
3. Client calls `GET /api/v1/rides?status=completed` (Ride Service)
4. Rides are displayed with real-time status

### 5. Payment Management

**Files Modified:**
- `app/(app)/payments.tsx`
- `services/api.ts`

**Flow:**
1. App loads payment methods
2. Client calls `GET /api/v1/payments/methods` (Payment Service)
3. App loads transaction history
4. Client calls `GET /api/v1/payments/transactions` (Payment Service)

## API Service Layer

The `services/api.ts` file provides a comprehensive API service layer with:

### Features:
- **Token Management**: Automatic JWT token handling
- **Error Handling**: Centralized error handling and user feedback
- **Type Safety**: Full TypeScript support with interfaces
- **Request/Response Interceptors**: Automatic header management

### Key Methods:
```typescript
// Authentication
sendOtp(phoneNumber: string)
verifyOtp(phoneNumber: string, otp: string)
logout()

// User Management
getCurrentUser()
updateProfile(profile: Partial<User['profile']>)

// Ride Management
estimateFare(pickup: LocationCoords, dropoff: LocationCoords)
bookRide(pickup, dropoff, pickupAddress, dropoffAddress, fare)
getRides(status?: Ride['status'])
cancelRide(rideId: string)

// Payment Management
getPaymentMethods()
addPaymentMethod(paymentToken: string)
getTransactions()

// Location Services
updateLocation(location: LocationCoords)
getNearbyDrivers(location: LocationCoords)

// Notifications
getNotifications()
markNotificationAsRead(notificationId: string)

// Analytics
trackEvent(event: string, data?: any)
```

## Context Providers

### AuthContext
Manages user authentication state and provides:
- User information
- Login/logout functions
- OTP sending functionality
- Authentication status

### RideContext
Manages ride-related state and provides:
- Current ride information
- Ride history
- Fare estimation
- Ride booking functionality

## Setup Instructions

### 1. Start Backend Services
```bash
cd server
# Start API Gateway
cd api-gateway && npm start

# Start all microservices (in separate terminals)
cd services/user-service && npm start
cd services/ride-service && npm start
cd services/location-service && npm start
cd services/payment-service && npm start
cd services/notification-service && npm start
cd services/analytics-service && npm start
cd services/admin-service && npm start
```

### 2. Start Client App
```bash
cd client/app/riders/ridersapp
npm start
```

### 3. Environment Configuration
Ensure the API Gateway is running on `http://localhost:5000` or update the `API_BASE_URL` in `services/api.ts`.

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: Automatic retry with user feedback
2. **Authentication Errors**: Automatic token refresh or logout
3. **Validation Errors**: User-friendly error messages
4. **Server Errors**: Graceful degradation with fallback UI

## Security Features

1. **JWT Token Storage**: Secure token storage using Expo SecureStore
2. **Request Headers**: Automatic Authorization header injection
3. **Token Refresh**: Automatic token refresh on expiration
4. **Input Validation**: Client-side validation before API calls

## Testing

### Manual Testing Checklist:
- [ ] Phone number verification flow
- [ ] Location permission and update
- [ ] Ride fare estimation
- [ ] Ride booking process
- [ ] Ride history display
- [ ] Payment methods management
- [ ] Transaction history
- [ ] Error handling scenarios
- [ ] Network connectivity issues
- [ ] Token expiration handling

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live ride tracking
2. **Push Notifications**: Integration with notification service
3. **Offline Support**: Offline-first architecture with sync
4. **Analytics**: User behavior tracking and analytics
5. **Payment Integration**: Stripe/PayPal integration
6. **Maps Integration**: Google Maps/Mapbox integration for navigation

## Troubleshooting

### Common Issues:

1. **API Connection Failed**
   - Check if backend services are running
   - Verify API Gateway port (5000)
   - Check network connectivity

2. **Authentication Errors**
   - Clear app storage and restart
   - Check JWT token validity
   - Verify user service is running

3. **Location Services Not Working**
   - Check device location permissions
   - Verify location service is running
   - Test with mock location data

4. **Ride Booking Fails**
   - Check ride service status
   - Verify location data format
   - Check fare estimation logic

For more detailed troubleshooting, refer to the individual service documentation in the `server/services/` directory.
