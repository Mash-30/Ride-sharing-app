# Jenkins CI/CD Pipeline Troubleshooting Guide

## 🚨 Common Build Issues and Solutions

### 1. **Missing Jenkinsfile**
**Problem**: No CI/CD configuration found
**Solution**: Use the provided `Jenkinsfile` in the root directory

### 2. **Docker Build Failures**

#### Issue: "Cannot connect to the Docker daemon"
```bash
# Solution: Ensure Docker is running and user has permissions
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Issue: "No such file or directory" during Docker build
```bash
# Solution: Check if all required files exist
ls -la server/services/user-service/
ls -la server/services/user-service/src/
```

#### Issue: TypeScript compilation errors
```bash
# Solution: Install TypeScript dependencies
cd server/services/user-service
npm install typescript ts-node-dev @types/node --save-dev
```

### 3. **Port Configuration Issues**

**Problem**: Services trying to use ports that are already in use
**Solution**: Updated docker-compose.yml to use consistent ports:
- API Gateway: 3000
- User Service: 5001
- Ride Service: 5002
- Location Service: 5003
- Payment Service: 5004
- Notification Service: 5005
- Analytics Service: 5006
- Admin Service: 5007

### 4. **Environment Variable Issues**

#### Missing MongoDB Connection
**Problem**: Services fail to start due to missing MongoDB
**Solution**: Add MongoDB service to docker-compose.yml or use external MongoDB

```yaml
# Add to docker-compose.yml
mongo:
  image: mongo:latest
  ports:
    - "27017:27017"
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=password
  volumes:
    - mongo_data:/data/db
  networks:
    - ride-sharing-network
```

### 5. **Node.js Version Issues**

**Problem**: Incompatible Node.js version
**Solution**: Use Node.js 18 (specified in Jenkinsfile)

```bash
# Install correct Node.js version
nvm install 18
nvm use 18
```

### 6. **Dependency Installation Failures**

#### Issue: "npm ci" fails
```bash
# Solution: Use npm install as fallback
npm ci --legacy-peer-deps || npm install --legacy-peer-deps
```

#### Issue: Missing peer dependencies
```bash
# Solution: Install with legacy peer deps
npm install --legacy-peer-deps
```

### 7. **Health Check Failures**

**Problem**: Services not responding to health checks
**Solution**: Ensure services have proper health endpoints

```typescript
// Add to each service
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'service-name' });
});
```

### 8. **Memory Issues**

**Problem**: Build fails due to insufficient memory
**Solution**: Increase Jenkins agent memory or optimize builds

```bash
# Add to Jenkinsfile environment
DOCKER_BUILDKIT=1
DOCKER_DEFAULT_PLATFORM=linux/amd64
```

## 🔧 Jenkins Configuration

### Required Jenkins Plugins
- Docker Pipeline
- Git
- NodeJS Plugin
- Workspace Cleanup Plugin

### Jenkins Agent Requirements
- Node.js 18+
- Docker
- At least 4GB RAM
- 10GB free disk space

### Environment Variables
```bash
# Set in Jenkins credentials
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password
```

## 🐛 Debugging Steps

### 1. Check Jenkins Logs
```bash
# View build logs
tail -f /var/log/jenkins/jenkins.log
```

### 2. Test Docker Build Locally
```bash
cd server
chmod +x build-services.sh
./build-services.sh
```

### 3. Test Individual Services
```bash
cd server/services/user-service
docker build -t test-user-service .
docker run -p 5001:5001 test-user-service
```

### 4. Check Service Dependencies
```bash
# Verify all required files exist
find server -name "package.json" -exec echo "Found: {}" \;
find server -name "Dockerfile" -exec echo "Found: {}" \;
```

## 📋 Pre-Build Checklist

- [ ] Jenkinsfile exists in root directory
- [ ] All services have package.json files
- [ ] All services have Dockerfile files
- [ ] All services have src/index.ts entry points
- [ ] Docker is installed and running
- [ ] Node.js 18+ is installed
- [ ] Ports are not conflicting
- [ ] Environment variables are set
- [ ] MongoDB is available (if required)

## 🚀 Quick Fix Commands

```bash
# Fix permissions
chmod +x server/build-services.sh

# Clean Docker
docker system prune -f

# Rebuild all services
cd server && ./build-services.sh

# Test docker-compose
docker-compose config
docker-compose up -d
```

## 📞 Support

If issues persist:
1. Check Jenkins build logs
2. Test builds locally
3. Verify all dependencies are installed
4. Ensure proper file permissions
5. Check network connectivity for Docker registry 