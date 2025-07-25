# Docker Deployment Guide

This guide explains how to containerize and deploy all microservices using Docker.

## 🐳 Docker Setup

### Prerequisites
- Docker installed on your system
- Docker Compose installed
- Git (to clone the repository)

### Quick Start

1. **Build all services:**
   ```bash
   # Make the build script executable
   chmod +x build-services.sh
   
   # Build all services
   ./build-services.sh
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Check service status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api-gateway
   ```

## 🏗️ Individual Service Deployment

### Build Individual Services

```bash
# API Gateway
docker build -t ride-sharing-api-gateway:latest ./api-gateway

# User Service
docker build -t ride-sharing-user-service:latest ./services/user-service

# Location Service
docker build -t ride-sharing-location-service:latest ./services/location-service

# Payment Service
docker build -t ride-sharing-payment-service:latest ./services/payment-service

# Ride Service
docker build -t ride-sharing-ride-service:latest ./services/ride-service

# Notification Service
docker build -t ride-sharing-notification-service:latest ./services/notification-service

# Admin Service
docker build -t ride-sharing-admin-service:latest ./services/admin-service

# Analytics Service
docker build -t ride-sharing-analytics-service:latest ./services/analytics-service
```

### Run Individual Services

```bash
# API Gateway
docker run -p 3000:3000 --env-file .env ride-sharing-api-gateway:latest

# User Service
docker run -p 3001:3001 --env-file .env ride-sharing-user-service:latest

# Location Service
docker run -p 3002:3002 --env-file .env ride-sharing-location-service:latest

# Payment Service
docker run -p 3003:3003 --env-file .env ride-sharing-payment-service:latest

# Ride Service
docker run -p 3004:3004 --env-file .env ride-sharing-ride-service:latest

# Notification Service
docker run -p 3005:3005 --env-file .env ride-sharing-notification-service:latest

# Admin Service
docker run -p 3006:3006 --env-file .env ride-sharing-admin-service:latest

# Analytics Service
docker run -p 3007:3007 --env-file .env ride-sharing-analytics-service:latest
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://mongo:27017/ride-sharing

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Service Ports
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
LOCATION_SERVICE_PORT=3002
PAYMENT_SERVICE_PORT=3003
RIDE_SERVICE_PORT=3004
NOTIFICATION_SERVICE_PORT=3005
ADMIN_SERVICE_PORT=3006
ANALYTICS_SERVICE_PORT=3007
```

## 🚀 Production Deployment

### Using Docker Compose

1. **Create production environment file:**
   ```bash
   cp .env .env.production
   # Edit .env.production with production values
   ```

2. **Deploy with production config:**
   ```bash
   docker-compose -f docker-compose.yml --env-file .env.production up -d
   ```

### Using Individual Containers

1. **Create a production network:**
   ```bash
   docker network create ride-sharing-network
   ```

2. **Run MongoDB:**
   ```bash
   docker run -d \
     --name mongo \
     --network ride-sharing-network \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password123 \
     mongo:6.0
   ```

3. **Run services:**
   ```bash
   # API Gateway
   docker run -d \
     --name api-gateway \
     --network ride-sharing-network \
     -p 3000:3000 \
     --env-file .env.production \
     ride-sharing-api-gateway:latest

   # User Service
   docker run -d \
     --name user-service \
     --network ride-sharing-network \
     -p 3001:3001 \
     --env-file .env.production \
     ride-sharing-user-service:latest

   # Continue for other services...
   ```

## 🔍 Health Checks

All services include health check endpoints:

- API Gateway: `http://localhost:3000/health`
- User Service: `http://localhost:3001/health`
- Location Service: `http://localhost:3002/health`
- Payment Service: `http://localhost:3003/health`
- Ride Service: `http://localhost:3004/health`
- Notification Service: `http://localhost:3005/health`
- Admin Service: `http://localhost:3006/health`
- Analytics Service: `http://localhost:3007/health`

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using a port
   netstat -tulpn | grep :3000
   
   # Kill process using port
   sudo kill -9 <PID>
   ```

2. **Container not starting:**
   ```bash
   # Check container logs
   docker logs <container-name>
   
   # Check container status
   docker ps -a
   ```

3. **Network issues:**
   ```bash
   # List networks
   docker network ls
   
   # Inspect network
   docker network inspect ride-sharing-network
   ```

### Useful Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build -d

# View resource usage
docker stats

# Clean up unused images
docker image prune -a

# Clean up unused containers
docker container prune
```

## 📊 Monitoring

### Docker Stats
```bash
# Real-time stats
docker stats

# Container resource usage
docker stats --no-stream
```

### Logs
```bash
# Follow logs for all services
docker-compose logs -f

# Follow logs for specific service
docker-compose logs -f api-gateway

# Last 100 lines
docker-compose logs --tail=100 api-gateway
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Enable Docker content trust**
4. **Regularly update base images**
5. **Scan images for vulnerabilities**

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker images
      run: |
        cd server
        chmod +x build-services.sh
        ./build-services.sh
    
    - name: Push to registry
      run: |
        # Add your registry push commands here
        echo "Push to registry"
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                dir('server') {
                    sh 'chmod +x build-services.sh'
                    sh './build-services.sh'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                dir('server') {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
```

## 📝 Notes

- All services use Node.js 18 Alpine for smaller image sizes
- Multi-stage builds optimize production images
- Health checks ensure service availability
- Non-root user for security
- Proper .dockerignore files exclude unnecessary files
- Environment variables for configuration
- Docker Compose for easy orchestration 