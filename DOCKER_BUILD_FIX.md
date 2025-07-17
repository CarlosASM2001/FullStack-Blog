# Docker Build Fix Guide

## 🔍 Error Analysis

The error you're seeing:
```
[backend] exporting to image:
target backend: failed to solve: failed to prepare extraction snapshot "extract-294115230-PV2u sha256:f96323df9e08f8151fe15828eb5ee45aab1931faa9026edbf1c85ee8f7d88ed0": parent snapshot sha256:78f502fe34d193a4d1f867286c15232156d5baa48c32257ee6352524a714f6fb does not exist: not found
```

This indicates a **corrupted Docker build cache** or **missing intermediate layers**. This commonly happens when:
- Docker build cache gets corrupted
- Interrupted previous builds left orphaned layers
- Insufficient disk space during build
- Docker daemon issues

## 🚀 Solution Steps (Try in Order)

### Step 1: Clean Docker System
```bash
# Remove all unused containers, networks, images, and build cache
docker system prune -a -f

# Remove all build cache specifically
docker builder prune -a -f
```

### Step 2: Clean Build Without Cache
```bash
# Stop and remove current containers
docker-compose down

# Build without using cache
docker-compose build --no-cache

# Start the application
docker-compose up -d
```

### Step 3: Individual Container Rebuild
```bash
# If the above doesn't work, rebuild just the backend
docker-compose build --no-cache backend

# Then start all services
docker-compose up -d
```

### Step 4: Complete Reset (Nuclear Option)
```bash
# Stop all containers
docker-compose down

# Remove all images related to your project
docker images | grep -E "(blog|backend|frontend)" | awk '{print $3}' | xargs docker rmi -f

# Remove all volumes (WARNING: This will delete your data)
docker volume prune -f

# Rebuild everything from scratch
docker-compose build --no-cache
docker-compose up -d
```

## 🛠 Using the Helper Script

If you're using the `docker-helper.sh` script I created:

### Method 1: Clean Build
```bash
# Clean everything and rebuild
./docker-helper.sh clean

# Start fresh
./docker-helper.sh start
```

### Method 2: Manual Clean Build
```bash
# Stop the application
./docker-helper.sh stop

# Clean Docker system manually, then
./docker-helper.sh start
```

## 🔧 Enhanced Docker Helper Script

Let me add a specific fix command to the helper script:

### New Commands to Add:
- `fix-build` - Fix Docker build issues
- `clean-cache` - Clean Docker build cache only
- `rebuild` - Force rebuild without cache

## 🧹 Manual Docker Cleanup Commands

If you prefer manual commands:

```bash
# 1. Clean build cache
docker builder prune -a -f

# 2. Clean system
docker system prune -a -f

# 3. Remove dangling images
docker image prune -f

# 4. Remove unused volumes
docker volume prune -f

# 5. Remove unused networks
docker network prune -f
```

## 🔍 Preventive Measures

### 1. Regular Cleanup
```bash
# Add to your weekly routine
docker system prune -f
```

### 2. Monitor Disk Space
```bash
# Check Docker disk usage
docker system df
```

### 3. Build with Specific Flags
```bash
# Always use --no-cache for problematic builds
docker-compose build --no-cache --pull
```

## 🚨 If Problems Persist

### Check Docker Version
```bash
docker --version
docker-compose --version
```

### Check Docker Daemon
```bash
# Restart Docker daemon (Linux)
sudo systemctl restart docker

# Or restart Docker Desktop (Windows/Mac)
```

### Check Disk Space
```bash
# Check available disk space
df -h

# Check Docker space usage
docker system df
```

### Alternative Build Method
If Docker Compose continues to fail, try building individually:

```bash
# Build backend manually
cd api
docker build -t blog-backend .

# Build frontend manually  
cd ../client
docker build -t blog-frontend .

# Then modify docker-compose.yml to use these images
```

## 📝 Immediate Action Plan

Run these commands in order on your local machine:

```bash
# 1. Stop everything
docker-compose down

# 2. Clean Docker system
docker system prune -a -f
docker builder prune -a -f

# 3. Rebuild without cache
docker-compose build --no-cache

# 4. Start the application
docker-compose up -d

# 5. Check status
docker-compose ps
```

## ✅ Success Indicators

After the fix, you should see:
- ✅ Clean build without errors
- ✅ All containers running
- ✅ Application accessible at http://localhost:3000
- ✅ Upload functionality working

## 🆘 Emergency Fallback

If all else fails, you can run the application without Docker:

### Backend (API)
```bash
cd api
npm install
npm start
```

### Frontend (Client)
```bash
cd client
npm install
npm start
```

This will run the application directly on your machine while you troubleshoot Docker issues.

## 📞 Additional Help

If the issue persists:
1. Check Docker logs: `docker-compose logs backend`
2. Verify Docker installation: `docker info`
3. Try restarting Docker service
4. Consider updating Docker to latest version

The build cache corruption is usually resolved with a clean rebuild. The steps above should get your application running again! 🚀