# Jenkins Server Setup Guide

This guide will help you configure your Jenkins server to resolve the build issues you're experiencing.

## 🔧 Prerequisites

Before running the Jenkins build, you need to configure your Jenkins server with the following:

### 1. Configure Sudo Access for Jenkins User

The error `sudo: a terminal is required to read the password` indicates that the Jenkins user doesn't have passwordless sudo access.

**On your Jenkins server, run these commands as root or a user with sudo privileges:**

```bash
# 1. Edit the sudoers file
sudo visudo

# 2. Add this line at the end of the file:
jenkins ALL=(ALL) NOPASSWD: ALL

# 3. Save and exit (Ctrl+X, then Y, then Enter)
```

**Alternative method (if visudo is not available):**
```bash
# Add the line to sudoers file directly
echo "jenkins ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers
```

### 2. Install Docker and Docker Compose

**Install Docker:**
```bash
# Update package list
sudo apt-get update

# Install required packages
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
```

**Install Docker Compose:**
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 3. Restart Jenkins Service

After making these changes, restart Jenkins for the changes to take effect:

```bash
# Restart Jenkins service
sudo systemctl restart jenkins

# Check Jenkins status
sudo systemctl status jenkins
```

### 4. Verify Docker Access

Test that the Jenkins user can access Docker:

```bash
# Switch to Jenkins user
sudo su - jenkins

# Test Docker access
docker --version
docker-compose --version
docker run hello-world
```

## 🚀 Running the Build

Once you've completed the server setup:

1. **Go to your Jenkins dashboard**
2. **Navigate to your project**
3. **Click "Build Now"**
4. **Monitor the build logs**

## 🔍 Troubleshooting

### If you still get sudo errors:

1. **Check if Jenkins user exists:**
   ```bash
   id jenkins
   ```

2. **If Jenkins user doesn't exist, create it:**
   ```bash
   sudo useradd -m -s /bin/bash jenkins
   ```

3. **Verify sudoers configuration:**
   ```bash
   sudo -l -U jenkins
   ```

### If Docker commands fail:

1. **Check Docker service status:**
   ```bash
   sudo systemctl status docker
   ```

2. **Check if Jenkins user is in docker group:**
   ```bash
   groups jenkins
   ```

3. **Restart Docker service:**
   ```bash
   sudo systemctl restart docker
   ```

### If ports are already in use:

1. **Check what's using the ports:**
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :5001
   ```

2. **Stop conflicting services or change ports in docker-compose.yml**

## 📋 Quick Setup Script

You can run this script on your Jenkins server to automate the setup:

```bash
#!/bin/bash
# Jenkins Server Setup Script

echo "🔧 Setting up Jenkins server..."

# Update system
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Configure sudo access for Jenkins
echo "jenkins ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Restart Jenkins
sudo systemctl restart jenkins

echo "✅ Setup completed! You can now run your Jenkins build."
```

## 🎯 Expected Results

After completing this setup, your Jenkins build should:

1. ✅ **Environment Setup** - Install Docker and Docker Compose successfully
2. ✅ **Client Build** - Install and build the React Native client
3. ✅ **Server Dependencies** - Install all microservice dependencies
4. ✅ **Docker Build** - Build all Docker images successfully
5. ✅ **Docker Compose Test** - Start services and run health checks
6. ✅ **Success** - Complete the build with all services healthy

## 📞 Support

If you encounter any issues after following this guide:

1. Check the Jenkins build logs for specific error messages
2. Verify all prerequisites are installed correctly
3. Ensure the Jenkins user has the necessary permissions
4. Test Docker commands manually as the Jenkins user

The updated Jenkinsfile includes better error handling and will provide more detailed feedback about what's failing during the build process. 