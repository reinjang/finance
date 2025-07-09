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

### Option 1: VPS with PM2 + Nginx

1. **Run the deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Update domain in nginx config**
   ```bash
   sudo nano /etc/nginx/sites-available/finance-planner
   # Replace 'your-domain.com' with your actual domain
   ```

3. **Restart services**
   ```bash
   sudo systemctl restart nginx
   pm2 restart all
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
