# Finance Planner - Deployment & Service Management Guide

This guide covers everything you need to deploy and manage the Finance Planner application on a VPS.

## 🏗️ Architecture Overview

- **Frontend**: React + Vite (Port 3000)
- **Backend**: FastAPI + Python (Port 8000)
- **Reverse Proxy**: Nginx (Port 80)
- **Process Management**: Systemd services

## 🚀 Initial Deployment

### Prerequisites
- Ubuntu/Debian VPS
- Root access (sudo)
- Git installed
- Domain name (optional)

### Step 1: Clone Repository
```bash
git clone https://github.com/reinjang/finance.git
cd finance
```

### Step 2: Setup Backend Service
```bash
# Make scripts executable
chmod +x setup-service.sh update-service.sh manage-services.sh

# Setup the API service
sudo ./setup-service.sh
```

### Step 3: Setup Frontend Service
```bash
# Setup the frontend service
sudo ./manage-services.sh setup-frontend
```

### Step 4: Configure Nginx (Optional)
```bash
# Copy nginx configuration
sudo cp nginx-config /etc/nginx/sites-available/finance-api

# Enable the site
sudo ln -s /etc/nginx/sites-available/finance-api /etc/nginx/sites-enabled/

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Service Management

### Quick Commands
```bash
# Check status of all services
sudo ./manage-services.sh status

# Restart all services
sudo ./manage-services.sh restart-all

# Stop all services
sudo ./manage-services.sh stop-all

# Start all services
sudo ./manage-services.sh start-all
```

### Individual Service Management
```bash
# Backend (API) Service
sudo ./manage-services.sh restart-api
sudo ./manage-services.sh stop-api
sudo ./manage-services.sh start-api

# Frontend Service
sudo ./manage-services.sh restart-frontend
sudo ./manage-services.sh stop-frontend
sudo ./manage-services.sh start-frontend
```

### View Logs
```bash
# Real-time logs
sudo ./manage-services.sh logs-api
sudo ./manage-services.sh logs-frontend

# Or use journalctl directly
sudo journalctl -u finance-api -f
sudo journalctl -u finance-frontend -f
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes and restart services
sudo ./update-service.sh

# Or manually
cd /var/www/finance-planner
git pull origin main
sudo ./manage-services.sh restart-all
```

### Kill Background Processes
If you have npm/node processes running in the background:
```bash
sudo ./manage-services.sh kill-background
```

## 🌐 Access Points

### Local Access (on VPS)
- **API Health**: `curl http://localhost:8000/health`
- **API Docs**: `http://localhost:8000/docs`
- **Frontend**: `http://localhost:3000`

### Remote Access
- **API**: `http://YOUR_VPS_IP:8000`
- **API Docs**: `http://YOUR_VPS_IP:8000/docs`
- **Health Check**: `http://YOUR_VPS_IP:8000/health`

## 📋 Service Details

### Backend Service (`finance-api`)
- **Service File**: `/etc/systemd/system/finance-api.service`
- **Working Directory**: `/var/www/finance-planner`
- **User**: `www-data`
- **Port**: 8000
- **Auto-restart**: Yes (5s delay)
- **Memory Limit**: 512MB

### Frontend Service (`finance-frontend`)
- **Service File**: `/etc/systemd/system/finance-frontend.service`
- **Working Directory**: `/var/www/finance-planner`
- **User**: `www-data`
- **Port**: 3000
- **Auto-restart**: Yes (5s delay)
- **Memory Limit**: 512MB

## 🔍 Troubleshooting

### Service Won't Start
```bash
# Check detailed status
sudo systemctl status finance-api -l
sudo systemctl status finance-frontend -l

# Check logs
sudo journalctl -u finance-api -n 20
sudo journalctl -u finance-frontend -n 20

# Check if ports are in use
sudo netstat -tlnp | grep -E ":(3000|8000)"
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

### Node.js Issues
```bash
# Reinstall dependencies
cd /var/www/finance-planner
sudo -u www-data rm -rf node_modules package-lock.json
sudo -u www-data npm install
sudo -u www-data npm run build
sudo systemctl restart finance-frontend
```

## 🔒 Security

### Firewall Configuration
```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000  # API port
sudo ufw allow 3000  # Frontend port (if needed)

# Enable firewall
sudo ufw enable
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring

### Check Resource Usage
```bash
# Service status with resource usage
sudo systemctl status finance-api
sudo systemctl status finance-frontend

# Process details
ps aux | grep uvicorn
ps aux | grep node

# System resources
htop
free -h
df -h
```

### Performance Monitoring
```bash
# Monitor in real-time
htop

# Check system resources
free -h
df -h

# Check disk usage
du -sh /var/www/finance-planner/*
```

## 🔧 Configuration Files

### Environment Variables
Location: `/var/www/finance-planner/.env`

**⚠️ SECURITY WARNING**: Never commit real IP addresses to git!

1. **Copy the template**:
   ```bash
   cp env.template .env.production
   ```

2. **Edit with your actual values**:
   ```bash
   nano .env.production
   # Replace YOUR_VPS_IP with your actual VPS IP
   ```

Example:
```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://203.0.113.1,https://203.0.113.1
VITE_API_URL=http://203.0.113.1:8000
NODE_ENV=production
```

### Nginx Configuration
Location: `/etc/nginx/sites-available/finance-api`
- Reverse proxy for API endpoints
- CORS headers
- Security headers
- SSL support

## 📝 Log Locations

- **Systemd logs**: `journalctl -u finance-api` / `journalctl -u finance-frontend`
- **Nginx logs**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- **Application logs**: Check service output in systemd logs

## 🚨 Emergency Procedures

### Complete Service Reset
```bash
# Stop all services
sudo ./manage-services.sh stop-all

# Kill any remaining processes
sudo ./manage-services.sh kill-background

# Restart all services
sudo ./manage-services.sh start-all
```

### Rollback to Previous Version
```bash
cd /var/www/finance-planner
git log --oneline -5
git reset --hard <commit-hash>
sudo ./manage-services.sh restart-all
```

### Backup and Restore
```bash
# Create backup
sudo tar -czf finance-backup-$(date +%Y%m%d).tar.gz /var/www/finance-planner

# Restore from backup
sudo tar -xzf finance-backup-YYYYMMDD.tar.gz -C /
sudo ./manage-services.sh restart-all
```

## 📞 Support Commands

### Quick Health Check
```bash
# Test API
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000

# Check service status
sudo ./manage-services.sh status
```

### Debug Mode
```bash
# Run services manually for debugging
cd /var/www/finance-planner

# Backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in another terminal)
npm run dev
```

## 🎯 Best Practices

1. **Always use the management scripts** instead of manual systemctl commands
2. **Check logs** when services fail to start
3. **Monitor resource usage** regularly
4. **Keep backups** before major updates
5. **Test changes** in a staging environment first
6. **Use SSL certificates** for production deployments
7. **Regular security updates** for the VPS

## 📚 Additional Resources

- [Systemd Service Documentation](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/docs/production-build/) 