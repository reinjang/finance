# Finance Planner API Service Setup

This guide explains how to set up the Finance Planner FastAPI backend as a dedicated systemd service on your VPS.

## 🚀 Quick Setup

### 1. Initial Service Setup

```bash
# On your VPS, clone the repository
git clone https://github.com/reinjang/finance.git
cd finance

# Make scripts executable
chmod +x setup-service.sh update-service.sh

# Run the setup script (requires sudo)
sudo ./setup-service.sh
```

### 2. Configure Nginx (Optional)

```bash
# Copy nginx configuration
sudo cp nginx-config /etc/nginx/sites-available/finance-api

# Enable the site
sudo ln -s /etc/nginx/sites-available/finance-api /etc/nginx/sites-enabled/

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 📋 Service Management

### Check Service Status
```bash
sudo systemctl status finance-api
```

### Start/Stop/Restart Service
```bash
sudo systemctl start finance-api
sudo systemctl stop finance-api
sudo systemctl restart finance-api
```

### View Logs
```bash
# Real-time logs
sudo journalctl -u finance-api -f

# Recent logs
sudo journalctl -u finance-api -n 50

# Logs since boot
sudo journalctl -u finance-api -b
```

### Enable/Disable Auto-start
```bash
sudo systemctl enable finance-api   # Start on boot
sudo systemctl disable finance-api  # Don't start on boot
```

## 🔄 Updating the Service

When you make changes to the code:

```bash
# Pull latest changes and restart service
sudo ./update-service.sh
```

Or manually:
```bash
cd /var/www/finance-planner
git pull origin main
sudo systemctl restart finance-api
```

## 🌐 Testing the API

### Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy", "message": "Finance Planner API is running"}
```

### API Documentation
- **Local**: http://localhost:8000/docs
- **Remote**: http://YOUR_VPS_IP:8000/docs

### Test API Endpoint
```bash
curl -X POST http://localhost:8000/api \
  -H "Content-Type: application/json" \
  -d '{
    "networth": 100000,
    "income": 5000,
    "expenses": 3000,
    "investments": [
      {
        "elementname": "Stocks",
        "elementratio": 60,
        "elementperformance": 8
      }
    ]
  }'
```

## 🔧 Configuration

### Environment Variables
The service uses these environment variables (set in `/var/www/finance/.env`):

```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://YOUR_VPS_IP,https://YOUR_VPS_IP
NODE_ENV=production
```

### Service Configuration
The service runs as `www-data` user with:
- **Working Directory**: `/var/www/finance`
- **Python Environment**: `/var/www/finance/venv`
- **Port**: 8000
- **Auto-restart**: Yes (5 seconds delay)
- **Memory Limit**: 512MB

## 🛠️ Troubleshooting

### Service Won't Start
```bash
# Check detailed status
sudo systemctl status finance-api -l

# Check logs
sudo journalctl -u finance-api -n 20

# Check if port is in use
sudo netstat -tlnp | grep :8000
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/finance-planner

# Fix permissions
sudo chmod -R 755 /var/www/finance-planner
```

### Python Environment Issues
```bash
# Recreate virtual environment
cd /var/www/finance-planner
sudo rm -rf venv
sudo -u www-data python3 -m venv venv
sudo -u www-data venv/bin/pip install -r requirements.txt
sudo systemctl restart finance-api
```

## 📊 Monitoring

### Check Resource Usage
```bash
# CPU and memory usage
sudo systemctl status finance-api

# Process details
ps aux | grep uvicorn
```

### Performance Monitoring
```bash
# Monitor in real-time
htop

# Check system resources
free -h
df -h
```

## 🔒 Security

The service includes several security features:
- Runs as non-root user (`www-data`)
- Restricted file system access
- Memory limits
- Private temporary directories
- System protection

## 📝 Logs Location

- **Systemd logs**: `journalctl -u finance-api`
- **Application logs**: Check the service output in systemd logs
- **Nginx logs**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log` 