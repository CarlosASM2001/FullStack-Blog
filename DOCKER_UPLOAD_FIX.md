# Docker Upload Persistence Fix

## 🔍 Problem Description

Your blog application was losing uploaded images every time you stopped and restarted the Docker containers. This is a common issue with Dockerized applications where files are stored inside the container's filesystem.

### Why This Happens

1. **Container Filesystem**: When you upload images, they're stored in the container's `/app/uploads` directory
2. **Container Lifecycle**: When you stop the container, all data inside it is lost
3. **No Persistence**: Without volume mounts, uploaded files disappear on container restart

## ✅ Solution Implemented

### 1. Docker Volume Mount

**Added to `docker-compose.yml`:**
```yaml
backend:
  # ... other config
  volumes:
    - uploads-data:/app/uploads  # Persist uploads directory
  # ... rest of config

volumes:
  mongo-data:
  uploads-data:  # New volume for uploads
```

### 2. Directory Creation in API

**Updated `api/index.js`:**
```javascript
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
```

### 3. Docker Build Optimization

**Created `api/.dockerignore`:**
```
node_modules
uploads      # Exclude uploads from build context
.env
.git
```

### 4. CORS Configuration Update

**Improved CORS for Docker environment:**
```javascript
app.use(cors({
    credentials: true, 
    origin: process.env.NODE_ENV === 'production' 
        ? ['http://localhost:3000', 'http://localhost', 'http://127.0.0.1:3000']
        : 'http://localhost:3000'
}));
```

## 🚀 How to Apply the Fix

### Option 1: Using the Helper Script (Recommended)

```bash
# Make the script executable (if not already done)
chmod +x docker-helper.sh

# Stop current containers
./docker-helper.sh stop

# Start with the new configuration
./docker-helper.sh start

# Check upload persistence status
./docker-helper.sh uploads
```

### Option 2: Manual Docker Commands

```bash
# Stop and remove current containers
docker-compose down

# Rebuild and start with new volume configuration
docker-compose up --build -d

# Verify uploads volume was created
docker volume ls | grep uploads
```

## 🛠 Docker Helper Script

The `docker-helper.sh` script provides convenient commands:

- `./docker-helper.sh start` - Start the blog application
- `./docker-helper.sh stop` - Stop the application
- `./docker-helper.sh restart` - Restart the application
- `./docker-helper.sh uploads` - Check upload persistence status
- `./docker-helper.sh backup` - Backup uploaded files
- `./docker-helper.sh restore <file>` - Restore from backup
- `./docker-helper.sh status` - Show application status
- `./docker-helper.sh logs` - View application logs
- `./docker-helper.sh clean` - Clean up everything

## 📁 What Happens Now

### Before the Fix:
```
Container Start → Upload Images → Container Stop → ❌ Images Lost
```

### After the Fix:
```
Container Start → Upload Images → Container Stop → ✅ Images Persisted
Container Restart → ✅ Images Still Available
```

## 🔧 Technical Details

### Volume Mapping
- **Host Volume**: Docker creates a named volume `uploads-data`
- **Container Path**: Maps to `/app/uploads` inside the backend container
- **Persistence**: Data survives container restarts, rebuilds, and updates

### Directory Structure
```
/app/uploads/           # Inside container
├── image1.jpg
├── image2.png
└── ...

uploads-data volume     # Docker volume (persistent)
├── image1.jpg
├── image2.png  
└── ...
```

### File Access
- **Upload**: Files are saved to the volume through the container
- **Serve**: Express static middleware serves files from the volume
- **Persistence**: Volume data persists even when containers are removed

## 🔍 Verifying the Fix

### 1. Check Volume Exists
```bash
docker volume ls | grep uploads-data
```

### 2. Check Files in Volume
```bash
docker-compose exec backend ls -la /app/uploads/
```

### 3. Test Upload Persistence
1. Start the application
2. Upload an image in a blog post
3. Stop the application: `./docker-helper.sh stop`
4. Start the application: `./docker-helper.sh start`
5. Check if the image still displays ✅

## 🆘 Troubleshooting

### Images Still Not Showing?

1. **Check if volume exists:**
   ```bash
   ./docker-helper.sh uploads
   ```

2. **Check container logs:**
   ```bash
   ./docker-helper.sh logs
   ```

3. **Verify file permissions:**
   ```bash
   docker-compose exec backend ls -la /app/uploads/
   ```

4. **Restart containers:**
   ```bash
   ./docker-helper.sh restart
   ```

### Migration from Old Setup

If you had images before the fix, you might need to:

1. **Backup existing uploads** (if any are still accessible)
2. **Clean restart** with the new configuration
3. **Re-upload** images if necessary

### Complete Reset (if needed)

```bash
# Clean everything and start fresh
./docker-helper.sh clean
./docker-helper.sh start
```

## 📋 Environment File

Make sure you have a `.env` file with:
```env
# MongoDB Configuration
MONGO_USER=bloguser
MONGO_PASS=blogpass
MONGO_DB=blogdb

# API Configuration
API_URL=http://localhost:4000
```

The helper script will create this automatically if it doesn't exist.

## ✅ Success Confirmation

After applying the fix, your uploaded images should:
- ✅ Display correctly when uploaded
- ✅ Persist after container restarts
- ✅ Remain available after application updates
- ✅ Be accessible via the `/uploads` endpoint

Your Docker upload persistence issue is now resolved! 🎉