#!/bin/bash

# Update Finance Planner Runtime Configuration
echo "🔧 Updating Finance Planner runtime configuration..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

APP_DIR="/root/finance"
CONFIG_FILE="$APP_DIR/public/config.js"

# Get VPS IP address
VPS_IP=$(hostname -I | awk '{print $1}' | head -1)

echo "📋 Detected VPS IP: $VPS_IP"

# Create the config file
cat > "$CONFIG_FILE" << EOF
// Runtime configuration for Finance Planner
// This file can be updated without rebuilding the application
window.FINANCE_CONFIG = {
  API_URL: 'http://$VPS_IP:8000',
  APP_TITLE: 'Finance Planner'
};
EOF

# Set correct permissions
chown www-data:www-data "$CONFIG_FILE"
chmod 644 "$CONFIG_FILE"

echo "✅ Configuration updated!"
echo "📄 Config file: $CONFIG_FILE"
echo "🌐 API URL: http://$VPS_IP:8000"

# Restart frontend service if it exists
if systemctl list-unit-files | grep -q "^finance-frontend.service"; then
    echo "🔄 Restarting frontend service..."
    systemctl restart finance-frontend
    echo "✅ Frontend service restarted"
else
    echo "⚠️ Frontend service not found. Please set it up first."
fi

echo ""
echo "🎯 Next steps:"
echo "1. Rebuild the frontend: npm run build"
echo "2. Restart the frontend service"
echo "3. Test the application" 