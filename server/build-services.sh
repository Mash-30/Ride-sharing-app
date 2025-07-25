#!/bin/bash

# Build script for all microservices
# This script builds Docker images for all microservices

set -e

echo "🚀 Starting Docker build for all microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to build a service
build_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo -e "${YELLOW}📦 Building $service_name...${NC}"
    
    if [ -f "$service_path/Dockerfile" ]; then
        docker build -t ride-sharing-$service_name:latest $service_path
        echo -e "${GREEN}✅ $service_name built successfully${NC}"
    else
        echo -e "${RED}❌ Dockerfile not found for $service_name${NC}"
        return 1
    fi
}

# Build all services
echo "Building API Gateway..."
build_service "api-gateway" "./api-gateway" "3000"

echo "Building User Service..."
build_service "user-service" "./services/user-service" "3001"

echo "Building Location Service..."
build_service "location-service" "./services/location-service" "3002"

echo "Building Payment Service..."
build_service "payment-service" "./services/payment-service" "3003"

echo "Building Ride Service..."
build_service "ride-service" "./services/ride-service" "3004"

echo "Building Notification Service..."
build_service "notification-service" "./services/notification-service" "3005"

echo "Building Admin Service..."
build_service "admin-service" "./services/admin-service" "3006"

echo "Building Analytics Service..."
build_service "analytics-service" "./services/analytics-service" "3007"

echo -e "${GREEN}🎉 All microservices built successfully!${NC}"
echo ""
echo "To run all services with Docker Compose:"
echo "docker-compose up -d"
echo ""
echo "To run individual services:"
echo "docker run -p 3000:3000 ride-sharing-api-gateway:latest"
echo "docker run -p 3001:3001 ride-sharing-user-service:latest"
echo "docker run -p 3002:3002 ride-sharing-location-service:latest"
echo "docker run -p 3003:3003 ride-sharing-payment-service:latest"
echo "docker run -p 3004:3004 ride-sharing-ride-service:latest"
echo "docker run -p 3005:3005 ride-sharing-notification-service:latest"
echo "docker run -p 3006:3006 ride-sharing-admin-service:latest"
echo "docker run -p 3007:3007 ride-sharing-analytics-service:latest" 