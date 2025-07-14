#!/bin/bash

# Finance Planner Services Management Script
echo "🔧 Finance Planner Services Management"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

SERVICE_API="finance-api"
SERVICE_FRONTEND="finance-frontend"
APP_DIR="/var/www/finance"

# Function to check if service exists
service_exists() {
    systemctl list-unit-files | grep -q "^$1.service"
}

# Function to check service status
check_status() {
    local service=$1
    if service_exists $service; then
        echo "📊 $service status:"
        systemctl status $service --no-pager -l
        echo ""
    else
        echo "❌ Service $service does not exist"
    fi
}

# Function to restart service
restart_service() {
    local service=$1
    if service_exists $service; then
        echo "🔄 Restarting $service..."
        systemctl restart $service
        sleep 2
        systemctl status $service --no-pager -l
    else
        echo "❌ Service $service does not exist"
    fi
}

# Function to stop service
stop_service() {
    local service=$1
    if service_exists $service; then
        echo "⏹️ Stopping $service..."
        systemctl stop $service
        echo "✅ $service stopped"
    else
        echo "❌ Service $service does not exist"
    fi
}

# Function to start service
start_service() {
    local service=$1
    if service_exists $service; then
        echo "▶️ Starting $service..."
        systemctl start $service
        sleep 2
        systemctl status $service --no-pager -l
    else
        echo "❌ Service $service does not exist"
    fi
}

# Function to setup frontend service
setup_frontend_service() {
    echo "🚀 Setting up frontend service..."
    
    # Copy service file
    cp finance-frontend.service /etc/systemd/system/
    chmod 644 /etc/systemd/system/finance-frontend.service
    
    # Ensure app directory exists and has correct permissions
    mkdir -p $APP_DIR
    chown -R www-data:www-data $APP_DIR
    
    # Install npm dependencies if needed
    cd $APP_DIR
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        sudo -u www-data npm install
    fi
    
    # Update runtime configuration
    echo "⚙️ Updating runtime configuration..."
    VPS_IP=$(hostname -I | awk '{print $1}' | head -1)
    cat > "public/config.js" << EOF
// Runtime configuration for Finance Planner
// This file can be updated without rebuilding the application
window.FINANCE_CONFIG = {
  API_URL: 'http://$VPS_IP:8000',
  APP_TITLE: 'Finance Planner'
};
EOF
    chown www-data:www-data public/config.js
    chmod 644 public/config.js

    # Build frontend if needed
    if [ ! -d "dist" ]; then
        echo "🔨 Building frontend..."
        sudo -u www-data npm run build
    fi
    
    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable $SERVICE_FRONTEND
    
    echo "✅ Frontend service setup complete!"
}

# Function to show running processes
show_processes() {
    echo "🔍 Checking for running finance processes..."
    echo ""
    echo "📋 Node.js processes:"
    ps aux | grep -E "(node|npm)" | grep -v grep || echo "No Node.js processes found"
    echo ""
    echo "📋 Python processes:"
    ps aux | grep -E "(python|uvicorn)" | grep -v grep || echo "No Python processes found"
    echo ""
    echo "📋 Port usage:"
    netstat -tlnp | grep -E ":(3000|8000)" || echo "No processes on ports 3000 or 8000"
}

# Main menu
case "${1:-}" in
    "status")
        echo "📊 Service Status Overview"
        echo "=========================="
        check_status $SERVICE_API
        check_status $SERVICE_FRONTEND
        show_processes
        ;;
    "restart-api")
        restart_service $SERVICE_API
        ;;
    "restart-frontend")
        restart_service $SERVICE_FRONTEND
        ;;
    "restart-all")
        echo "🔄 Restarting all services..."
        restart_service $SERVICE_API
        restart_service $SERVICE_FRONTEND
        ;;
    "stop-api")
        stop_service $SERVICE_API
        ;;
    "stop-frontend")
        stop_service $SERVICE_FRONTEND
        ;;
    "stop-all")
        echo "⏹️ Stopping all services..."
        stop_service $SERVICE_API
        stop_service $SERVICE_FRONTEND
        ;;
    "start-api")
        start_service $SERVICE_API
        ;;
    "start-frontend")
        start_service $SERVICE_FRONTEND
        ;;
    "start-all")
        echo "▶️ Starting all services..."
        start_service $SERVICE_API
        start_service $SERVICE_FRONTEND
        ;;
    "setup-frontend")
        setup_frontend_service
        ;;
    "logs-api")
        echo "📝 API Service Logs:"
        journalctl -u $SERVICE_API -f
        ;;
    "logs-frontend")
        echo "📝 Frontend Service Logs:"
        journalctl -u $SERVICE_FRONTEND -f
        ;;
    "kill-background")
        echo "🔪 Killing background npm/node processes..."
        pkill -f "npm start" || echo "No npm start processes found"
        pkill -f "node.*vite" || echo "No vite processes found"
        pkill -f "uvicorn" || echo "No uvicorn processes found"
        echo "✅ Background processes killed"
        ;;
    *)
        echo "🔧 Finance Planner Services Management"
        echo "====================================="
        echo ""
        echo "Usage: sudo $0 [command]"
        echo ""
        echo "Commands:"
        echo "  status              - Show status of all services"
        echo "  restart-api         - Restart API service"
        echo "  restart-frontend    - Restart frontend service"
        echo "  restart-all         - Restart all services"
        echo "  stop-api            - Stop API service"
        echo "  stop-frontend       - Stop frontend service"
        echo "  stop-all            - Stop all services"
        echo "  start-api           - Start API service"
        echo "  start-frontend      - Start frontend service"
        echo "  start-all           - Start all services"
        echo "  setup-frontend      - Setup frontend service"
        echo "  logs-api            - Show API logs (follow)"
        echo "  logs-frontend       - Show frontend logs (follow)"
        echo "  kill-background     - Kill background npm/node processes"
        echo ""
        echo "Examples:"
        echo "  sudo $0 status"
        echo "  sudo $0 restart-all"
        echo "  sudo $0 kill-background"
        ;;
esac 