#!/bin/bash

# Finance Planner VPS Deployment Script
echo "🚀 Starting Finance Planner deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# Install nginx
echo "🌐 Installing nginx..."
sudo apt install -y nginx

# Install PM2 for process management
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/finance-planner
sudo chown $USER:$USER /var/www/finance-planner

# Copy application files (assuming you're running this from the project directory)
echo "📋 Copying application files..."
cp -r . /var/www/finance-planner/
cd /var/www/finance-planner

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Setup Python virtual environment
echo "🐍 Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > .env << EOF
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://your-domain.com,https://your-domain.com
VITE_API_URL=http://localhost:8000
NODE_ENV=production
EOF

# Setup PM2 ecosystem
echo "⚡ Setting up PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'finance-backend',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      cwd: '/var/www/finance-planner',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'finance-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/finance-planner',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup nginx configuration
echo "🌐 Setting up nginx..."
sudo tee /etc/nginx/sites-available/finance-planner << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site and restart nginx
sudo ln -sf /etc/nginx/sites-available/finance-planner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at: http://your-domain.com"
echo "📊 PM2 Status: pm2 status"
echo "📝 Logs: pm2 logs"
echo "🔄 Restart: pm2 restart all" 