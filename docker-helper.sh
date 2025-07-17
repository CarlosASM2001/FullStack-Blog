#!/bin/bash

# Blog Docker Helper Script
# This script helps manage your Dockerized blog application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Blog Docker Helper${NC}"
echo "=========================="

# Function to check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        echo -e "${RED}❌ Error: .env file not found${NC}"
        echo "Creating a sample .env file..."
        cat > .env << EOF
# MongoDB Configuration
MONGO_USER=bloguser
MONGO_PASS=blogpass
MONGO_DB=blogdb

# API Configuration
API_URL=http://localhost:4000
EOF
        echo -e "${GREEN}✅ Sample .env file created. Please review and update it if needed.${NC}"
    else
        echo -e "${GREEN}✅ .env file found${NC}"
    fi
}

# Function to build and start containers
start_blog() {
    echo -e "${YELLOW}🚀 Starting blog application...${NC}"
    check_env
    docker-compose up --build -d
    echo -e "${GREEN}✅ Blog application started!${NC}"
    echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
    echo -e "${BLUE}🔧 Backend: http://localhost:4000${NC}"
    echo -e "${BLUE}🗃️  MongoDB: localhost:27017${NC}"
}

# Function to stop containers
stop_blog() {
    echo -e "${YELLOW}🛑 Stopping blog application...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Blog application stopped${NC}"
}

# Function to restart containers
restart_blog() {
    echo -e "${YELLOW}🔄 Restarting blog application...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Blog application restarted${NC}"
}

# Function to view logs
show_logs() {
    echo -e "${YELLOW}📋 Showing logs...${NC}"
    docker-compose logs -f
}

# Function to check upload volumes
check_uploads() {
    echo -e "${YELLOW}📁 Checking upload persistence...${NC}"
    
    # Check if uploads volume exists
    if docker volume ls | grep -q "uploads-data"; then
        echo -e "${GREEN}✅ Uploads volume exists${NC}"
        
        # Show volume info
        echo -e "${BLUE}Volume details:${NC}"
        docker volume inspect $(basename $(pwd))_uploads-data 2>/dev/null || echo "Volume not found"
        
        # Check if backend container is running
        if docker-compose ps backend | grep -q "Up"; then
            echo -e "${GREEN}✅ Backend container is running${NC}"
            echo -e "${BLUE}Upload directory contents:${NC}"
            docker-compose exec backend ls -la /app/uploads/ 2>/dev/null || echo "Could not access uploads directory"
        else
            echo -e "${YELLOW}⚠️  Backend container is not running${NC}"
        fi
    else
        echo -e "${RED}❌ Uploads volume not found${NC}"
        echo "This might be normal if you haven't started the application yet."
    fi
}

# Function to backup uploads
backup_uploads() {
    echo -e "${YELLOW}💾 Creating backup of uploads...${NC}"
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="uploads_backup_$timestamp"
    
    if docker volume ls | grep -q "uploads-data"; then
        docker run --rm -v $(basename $(pwd))_uploads-data:/data -v $(pwd):/backup alpine tar czf /backup/$backup_dir.tar.gz -C /data .
        echo -e "${GREEN}✅ Backup created: $backup_dir.tar.gz${NC}"
    else
        echo -e "${RED}❌ No uploads volume found to backup${NC}"
    fi
}

# Function to restore uploads
restore_uploads() {
    if [ -z "$1" ]; then
        echo -e "${RED}❌ Error: Please specify backup file${NC}"
        echo "Usage: $0 restore <backup_file.tar.gz>"
        return 1
    fi
    
    if [ ! -f "$1" ]; then
        echo -e "${RED}❌ Error: Backup file not found: $1${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}📤 Restoring uploads from $1...${NC}"
    docker run --rm -v $(basename $(pwd))_uploads-data:/data -v $(pwd):/backup alpine tar xzf /backup/$1 -C /data
    echo -e "${GREEN}✅ Uploads restored from $1${NC}"
}

# Function to clean up everything
clean_all() {
    echo -e "${YELLOW}🧹 Cleaning up everything...${NC}"
    read -p "This will remove all containers, volumes, and images. Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        echo -e "${GREEN}✅ Everything cleaned up${NC}"
    else
        echo -e "${BLUE}Operation cancelled${NC}"
    fi
}

# Main script logic
case "$1" in
    "start")
        start_blog
        ;;
    "stop")
        stop_blog
        ;;
    "restart")
        restart_blog
        ;;
    "logs")
        show_logs
        ;;
    "uploads")
        check_uploads
        ;;
    "backup")
        backup_uploads
        ;;
    "restore")
        restore_uploads "$2"
        ;;
    "clean")
        clean_all
        ;;
    "status")
        echo -e "${YELLOW}📊 Application Status:${NC}"
        docker-compose ps
        echo
        check_uploads
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|uploads|backup|restore|clean|status}"
        echo
        echo "Commands:"
        echo "  start   - Build and start the blog application"
        echo "  stop    - Stop the blog application"
        echo "  restart - Restart the blog application"
        echo "  logs    - Show application logs"
        echo "  uploads - Check upload persistence status"
        echo "  backup  - Create backup of uploads"
        echo "  restore - Restore uploads from backup"
        echo "  clean   - Remove all containers, volumes, and images"
        echo "  status  - Show application and upload status"
        exit 1
        ;;
esac