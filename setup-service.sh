#!/bin/bash

# Finance Planner API Service Setup Script
echo "🚀 Setting up Finance Planner API as a systemd service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Set variables
SERVICE_NAME="finance-api"
APP_DIR="/var/www/finance-planner"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "📁 Setting up application directory..."
# Create application directory if it doesn't exist
mkdir -p $APP_DIR
chown www-data:www-data $APP_DIR

echo "📋 Copying service file..."
# Copy the service file
cp finance-api.service $SERVICE_FILE
chmod 644 $SERVICE_FILE

echo "🐍 Setting up Python virtual environment..."
# Navigate to app directory
cd $APP_DIR

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    chown -R www-data:www-data venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "⚙️ Creating environment configuration..."
# Create environment file
cat > .env << EOF
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://92.62.118.113,https://92.62.118.113,http://localhost:5173,http://127.0.0.1:5173
NODE_ENV=production
EOF

chown www-data:www-data .env

echo "🔄 Reloading systemd..."
# Reload systemd to recognize the new service
systemctl daemon-reload

echo "✅ Enabling service..."
# Enable the service to start on boot
systemctl enable $SERVICE_NAME

echo "🚀 Starting service..."
# Start the service
systemctl start $SERVICE_NAME

echo "📊 Checking service status..."
# Check service status
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "✅ Service setup complete!"
echo ""
echo "📋 Useful commands:"
echo "   Status:     sudo systemctl status $SERVICE_NAME"
echo "   Start:      sudo systemctl start $SERVICE_NAME"
echo "   Stop:       sudo systemctl stop $SERVICE_NAME"
echo "   Restart:    sudo systemctl restart $SERVICE_NAME"
echo "   Logs:       sudo journalctl -u $SERVICE_NAME -f"
echo "   Enable:     sudo systemctl enable $SERVICE_NAME"
echo "   Disable:    sudo systemctl disable $SERVICE_NAME"
echo ""
echo "🌐 Test the API:"
echo "   Health:     curl http://localhost:8000/health"
echo "   Docs:       http://92.62.118.113:8000/docs"
echo "" 