# Finance Planner

A modern financial planning application that helps you project your net worth over 10 years based on your income, expenses, and investment allocations.

## Features

- 📊 **Interactive Charts**: Visualize your financial projections with Chart.js
- 💰 **Investment Portfolio**: Manage multiple investment allocations with performance rates
- 🎯 **10-Year Projections**: See how your net worth will grow over time
- 🌙 **Neon Dark UI**: Modern, responsive design with Tailwind CSS
- ⚡ **Fast API**: Backend powered by FastAPI for quick calculations

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Chart.js
- **Backend**: FastAPI + Python
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

Create a `.env` file based on `env.example`:

```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://your-domain.com
VITE_API_URL=http://localhost:8000
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
