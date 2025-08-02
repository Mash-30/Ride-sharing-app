# Jenkins CI/CD Setup Guide for Ride-Sharing App

## 🎯 Two Approaches Available

### **Option 1: Jenkinsfile (Recommended)**
- **Best for**: Production CI/CD pipelines
- **Features**: Multi-stage builds, conditional stages, better error handling
- **File**: `Jenkinsfile` in root directory

### **Option 2: Execute Shell Script (Simple)**
- **Best for**: Quick setup, simple deployments
- **Features**: Single script, easy to modify
- **File**: `jenkins-execute-shell.sh`

---

## 🚀 Option 1: Jenkinsfile Setup

### Step 1: Configure Jenkins Job
1. **Create a new Pipeline job** in Jenkins
2. **Pipeline script from SCM**: Select Git
3. **Repository URL**: Your Git repository URL
4. **Script Path**: `Jenkinsfile`
5. **Branch**: `main` or your target branch

### Step 2: Required Jenkins Plugins
Install these plugins in Jenkins:
- **Pipeline**
- **Git**
- **Docker Pipeline**
- **NodeJS Plugin**
- **Workspace Cleanup Plugin**

### Step 3: Configure Environment Variables
In Jenkins → Manage Jenkins → Configure System:
```
DOCKER_REGISTRY=your-registry.com
NODE_VERSION=18
```

### Step 4: Run the Pipeline
The Jenkinsfile will automatically:
- ✅ Checkout code
- ✅ Install Node.js 18
- ✅ Install Docker
- ✅ Build client (if changed)
- ✅ Install server dependencies
- ✅ Build all Docker images
- ✅ Test docker-compose
- ✅ Security scan
- ✅ Push to registry (if on main branch)
- ✅ Deploy to staging (if on main branch)

---

## 🔧 Option 2: Execute Shell Setup

### Step 1: Configure Jenkins Job
1. **Create a new Freestyle job** in Jenkins
2. **Source Code Management**: Git
3. **Repository URL**: Your Git repository URL
4. **Branch**: `main` or your target branch

### Step 2: Build Section
1. **Add build step**: "Execute shell"
2. **Copy the entire content** from `jenkins-execute-shell.sh`
3. **Paste it** into the Execute shell text area

### Step 3: Run the Job
The script will automatically:
- ✅ Navigate to server directory
- ✅ Build all microservices
- ✅ Start services with docker-compose
- ✅ Test health endpoints
- ✅ Display service URLs

---

## 📋 Pre-requisites

### Jenkins Server Requirements
- **RAM**: Minimum 4GB, Recommended 8GB
- **Disk**: At least 10GB free space
- **Docker**: Installed and running
- **Node.js**: 18+ (will be installed by script)

### Required Software on Jenkins Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18
```

---

## 🧪 Testing Your Setup

### Local Testing (Before Jenkins)
```bash
# Test the build process locally
chmod +x test-build.sh
./test-build.sh

# Test the actual build
cd server
chmod +x build-services.sh
./build-services.sh
docker-compose up -d

# Test health endpoints
curl http://localhost:3000/health
curl http://localhost:5001/health
```

### Jenkins Testing
1. **Run the job** in Jenkins
2. **Check the console output** for any errors
3. **Verify services are running**:
   ```bash
   docker ps
   curl http://localhost:3000/health
   ```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Cannot connect to Docker daemon"
```bash
# Solution: Ensure Docker is running and user has permissions
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. "No such file or directory"
```bash
# Solution: Check if all files exist
ls -la server/build-services.sh
ls -la server/docker-compose.yml
```

#### 3. "Port already in use"
```bash
# Solution: Stop existing containers
docker-compose down
docker system prune -f
```

#### 4. "npm ci failed"
```bash
# Solution: Use npm install as fallback
npm ci --legacy-peer-deps || npm install --legacy-peer-deps
```

### Debugging Steps
1. **Check Jenkins logs**: View the console output
2. **Test locally**: Run the same commands on Jenkins server
3. **Verify permissions**: Ensure Jenkins user can run Docker
4. **Check disk space**: Ensure enough free space
5. **Verify network**: Check if Jenkins can access external resources

---

## 📊 Expected Results

### Successful Build Output
```
🚀 Starting Jenkins build for Ride-Sharing App...
📦 Building all microservices...
✅ All Docker images built successfully
🐳 Starting services with docker-compose...
✅ All services started successfully
⏳ Waiting for services to be ready...
🧪 Testing service health...
✅ API Gateway is healthy
✅ User Service is healthy
✅ Location Service is healthy
🎉 Build and deployment completed successfully!

🌐 Services are running on:
   API Gateway: http://localhost:3000
   User Service: http://localhost:5001
   Location Service: http://localhost:5003
   Payment Service: http://localhost:5004
   Ride Service: http://localhost:5002
   Notification Service: http://localhost:5005
   Analytics Service: http://localhost:5006
   Admin Service: http://localhost:5007

📊 Health Check: http://localhost:3000/health
```

### Service URLs
- **Main API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/

---

## 🎯 Next Steps

1. **Choose your approach** (Jenkinsfile or Execute Shell)
2. **Set up Jenkins job** following the guide above
3. **Test locally** before running on Jenkins
4. **Configure notifications** (email, Slack, etc.)
5. **Set up monitoring** for the deployed services
6. **Configure production deployment** when ready

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Jenkins console logs
3. Test commands locally on Jenkins server
4. Verify all prerequisites are met
5. Check the `JENKINS_TROUBLESHOOTING.md` file for detailed solutions 