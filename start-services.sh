#!/bin/bash

# Ride Sharing App - Service Startup Script
# This script starts all the backend microservices

echo "🚀 Starting Ride Sharing App Backend Services..."

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "📦 Starting $service_name on port $port..."
    cd "$service_path" || exit 1
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ Error: package.json not found in $service_path"
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing dependencies for $service_name..."
        npm install
    fi
    
    # Start the service in background
    npm start &
    local pid=$!
    echo "✅ $service_name started with PID: $pid"
    
    # Wait a bit for the service to start
    sleep 2
}

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"

# Check if server directory exists
if [ ! -d "$SERVER_DIR" ]; then
    echo "❌ Error: Server directory not found at $SERVER_DIR"
    exit 1
fi

# Start API Gateway first
echo "🌐 Starting API Gateway..."
start_service "API Gateway" "$SERVER_DIR/api-gateway" 5000

# Start all microservices
echo "🔧 Starting Microservices..."

start_service "User Service" "$SERVER_DIR/services/user-service" 5001
start_service "Ride Service" "$SERVER_DIR/services/ride-service" 5002
start_service "Location Service" "$SERVER_DIR/services/location-service" 5003
start_service "Payment Service" "$SERVER_DIR/services/payment-service" 5004
start_service "Notification Service" "$SERVER_DIR/services/notification-service" 5005
start_service "Analytics Service" "$SERVER_DIR/services/analytics-service" 5006
start_service "Admin Service" "$SERVER_DIR/services/admin-service" 5007

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📱 To start the client app, run:"
echo "   cd client/app/riders/ridersapp"
echo "   npm start"
echo ""
echo "🌐 API Gateway is running on: http://localhost:5000"
echo ""
echo "📋 Service Status:"
echo "   - API Gateway: http://localhost:5000"
echo "   - User Service: http://localhost:5001"
echo "   - Ride Service: http://localhost:5002"
echo "   - Location Service: http://localhost:5003"
echo "   - Payment Service: http://localhost:5004"
echo "   - Notification Service: http://localhost:5005"
echo "   - Analytics Service: http://localhost:5006"
echo "   - Admin Service: http://localhost:5007"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for user to stop the script
wait 