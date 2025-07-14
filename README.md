# Finance Planner

A modern financial planning application that helps you project your net worth over 10 years based on your income, expenses, and investment allocations.

## Features

- 📊 **Interactive Charts**: Visualize your financial projections with Chart.js
- 💰 **Investment Portfolio**: Manage multiple investment allocations with performance rates
- 🎯 **10-Year Projections**: See how your net worth will grow over time
- 🌙 **Neon Dark UI**: Modern, responsive design with Tailwind CSS
- ⚡ **Fast API**: Backend powered by FastAPI for quick calculations
- 🗄️ **PocketBase Database**: Embedded database with web admin UI (http://your-domain.com:8090/_/)

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Chart.js
- **Backend**: FastAPI + Python, PocketBase (embedded DB with admin UI)
- **Deployment**: PM2 + Nginx (or Docker)

## Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/reinjang/finance.git
   cd finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2: Start frontend
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/docs

## Deployment

### PocketBase Database

PocketBase is automatically installed and started as part of the deployment. It provides a web-based admin UI for managing your app's database, accessible at:

    http://your-domain.com:8090/_/

You can create collections, fields, and manage data directly from this UI after deployment.

### 🚀 Production Deployment (Recommended)

For a complete production setup with systemd services, see the comprehensive **[Deployment Guide](README-DEPLOYMENT.md)**.

### Quick Setup Commands:
```bash
# Clone and setup
git clone https://github.com/reinjang/finance.git
cd finance
chmod +x *.sh

# Setup services
sudo ./setup-service.sh
sudo ./manage-services.sh setup-frontend

# Check status
sudo ./manage-services.sh status
```

### Option 1: VPS with Systemd Services (Recommended)

1. **Run the setup scripts**
   ```bash
   sudo ./setup-service.sh
   sudo ./manage-services.sh setup-frontend
   ```

2. **Manage services**
   ```bash
   sudo ./manage-services.sh status
   sudo ./manage-services.sh restart-all
   ```

### Option 2: Docker

1. **Build and run with Docker**
   ```bash
   docker build -t finance-planner .
   docker run -p 8000:8000 finance-planner
   ```

2. **Or use Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Environment Variables

**⚠️ SECURITY WARNING**: Never commit real IP addresses or sensitive data to git!

Create a `.env` file based on `env.template`:

```bash
# Copy template
cp env.template .env.production

# Edit with your actual values
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

## API Documentation

The FastAPI backend provides automatic documentation at `/docs` when running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
