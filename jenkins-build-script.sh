#!/bin/bash

# Jenkins Build Script for Ride-Sharing App
# This script builds all microservices and runs them with docker-compose

set -e

echo "🚀 Starting Jenkins build for Ride-Sharing App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to server directory
cd server

echo -e "${YELLOW}📦 Building all microservices...${NC}"

# Make build script executable
chmod +x build-services.sh

# Build all services
if ./build-services.sh; then
    echo -e "${GREEN}✅ All Docker images built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🐳 Starting services with docker-compose...${NC}"

# Start all services with docker-compose
if docker-compose up -d; then
    echo -e "${GREEN}✅ All services started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

# Wait for services to start
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Test health endpoints
echo -e "${YELLOW}🧪 Testing service health...${NC}"

# Test API Gateway
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway is healthy${NC}"
else
    echo -e "${RED}❌ API Gateway health check failed${NC}"
fi

# Test User Service
if curl -f http://localhost:5001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ User Service is healthy${NC}"
else
    echo -e "${RED}❌ User Service health check failed${NC}"
fi

# Test Location Service
if curl -f http://localhost:5003/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Location Service is healthy${NC}"
else
    echo -e "${RED}❌ Location Service health check failed${NC}"
fi

echo -e "${GREEN}🎉 Build and deployment completed successfully!${NC}"
echo ""
echo "🌐 Services are running on:"
echo "   API Gateway: http://localhost:3000"
echo "   User Service: http://localhost:5001"
echo "   Location Service: http://localhost:5003"
echo "   Payment Service: http://localhost:5004"
echo "   Ride Service: http://localhost:5002"
echo "   Notification Service: http://localhost:5005"
echo "   Analytics Service: http://localhost:5006"
echo "   Admin Service: http://localhost:5007"
echo ""
echo "📊 Health Check: http://localhost:3000/health" 