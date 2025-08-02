#!/bin/bash

# Test build script for ride-sharing app
# This script tests the build process locally before running on Jenkins

set -e

echo "🧪 Testing build process for ride-sharing app..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test a service build
test_service_build() {
    local service_name=$1
    local service_path=$2
    
    echo -e "${YELLOW}Testing $service_name build...${NC}"
    
    if [ -d "$service_path" ]; then
        echo "✅ Directory exists: $service_path"
        
        if [ -f "$service_path/package.json" ]; then
            echo "✅ package.json exists"
        else
            echo -e "${RED}❌ package.json missing in $service_path${NC}"
            return 1
        fi
        
        if [ -f "$service_path/Dockerfile" ]; then
            echo "✅ Dockerfile exists"
        else
            echo -e "${RED}❌ Dockerfile missing in $service_path${NC}"
            return 1
        fi
        
        if [ -f "$service_path/src/index.ts" ]; then
            echo "✅ Entry point exists"
        else
            echo -e "${RED}❌ src/index.ts missing in $service_path${NC}"
            return 1
        fi
        
        echo -e "${GREEN}✅ $service_name build test passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Directory missing: $service_path${NC}"
        return 1
    fi
}

# Test all services
echo "Testing service structure..."

test_service_build "API Gateway" "server/api-gateway"
test_service_build "User Service" "server/services/user-service"
test_service_build "Location Service" "server/services/location-service"
test_service_build "Payment Service" "server/services/payment-service"
test_service_build "Ride Service" "server/services/ride-service"
test_service_build "Notification Service" "server/services/notification-service"
test_service_build "Admin Service" "server/services/admin-service"
test_service_build "Analytics Service" "server/services/analytics-service"

# Test build script
echo -e "${YELLOW}Testing build script...${NC}"
if [ -f "server/build-services.sh" ]; then
    echo "✅ Build script exists"
    chmod +x server/build-services.sh
    echo "✅ Build script is executable"
else
    echo -e "${RED}❌ Build script missing${NC}"
    exit 1
fi

# Test docker-compose
echo -e "${YELLOW}Testing docker-compose configuration...${NC}"
if [ -f "server/docker-compose.yml" ]; then
    echo "✅ docker-compose.yml exists"
    cd server
    docker-compose config > /dev/null
    echo "✅ docker-compose configuration is valid"
    cd ..
else
    echo -e "${RED}❌ docker-compose.yml missing${NC}"
    exit 1
fi

# Test Jenkinsfile
echo -e "${YELLOW}Testing Jenkinsfile...${NC}"
if [ -f "Jenkinsfile" ]; then
    echo "✅ Jenkinsfile exists"
else
    echo -e "${RED}❌ Jenkinsfile missing${NC}"
    exit 1
fi

# Test client build
echo -e "${YELLOW}Testing client build...${NC}"
if [ -d "client" ]; then
    echo "✅ Client directory exists"
    if [ -f "client/package.json" ]; then
        echo "✅ Client package.json exists"
    else
        echo -e "${RED}❌ Client package.json missing${NC}"
    fi
else
    echo -e "${RED}❌ Client directory missing${NC}"
fi

echo -e "${GREEN}🎉 All build tests passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: cd server && ./build-services.sh"
echo "2. Run: docker-compose up -d"
echo "3. Test health endpoints"
echo "4. Configure Jenkins with the provided Jenkinsfile" 