#!/bin/bash

# Finance Planner API Service Update Script
echo "🔄 Updating Finance Planner API service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

SERVICE_NAME="finance-api"
APP_DIR="/var/www/finance"

echo "📁 Updating application files..."
cd $APP_DIR

# Pull latest changes from git
echo "📥 Pulling latest changes from git..."
git pull origin main

echo "🐍 Updating Python dependencies..."
# Activate virtual environment and update dependencies
source venv/bin/activate
pip install -r requirements.txt

echo "🔄 Restarting service..."
# Restart the service to apply changes
systemctl restart $SERVICE_NAME

echo "📊 Checking service status..."
# Check service status
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "✅ Service update complete!"
echo ""
echo "🌐 Test the API:"
echo "   Health:     curl http://localhost:8000/health"
echo "   Status:     sudo systemctl status $SERVICE_NAME"
echo "   Logs:       sudo journalctl -u $SERVICE_NAME -f"
echo "" 